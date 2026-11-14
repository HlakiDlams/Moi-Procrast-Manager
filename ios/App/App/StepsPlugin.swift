import Foundation
import Capacitor
import CoreMotion

/// The app's main screen. Registers the app's own native plugins.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(StepsPlugin())
    }
}

/// Steps from the iPhone's motion chip (CoreMotion). The iPhone keeps the last 7 days itself,
/// so we just ask for each day's total. Same JS API as the Android plugin.
@objc(StepsPlugin)
public class StepsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "StepsPlugin"
    public let jsName = "Steps"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestPermission", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "sync", returnType: CAPPluginReturnPromise),
    ]

    private let pedometer = CMPedometer()

    private func statusObject() -> [String: Any] {
        return [
            "available": CMPedometer.isStepCountingAvailable(),
            "granted": CMPedometer.authorizationStatus() == .authorized,
        ]
    }

    @objc func status(_ call: CAPPluginCall) {
        call.resolve(statusObject())
    }

    /// Asking for data the first time shows the "Motion & Fitness" permission prompt.
    @objc func requestPermission(_ call: CAPPluginCall) {
        guard CMPedometer.isStepCountingAvailable() else {
            call.resolve(statusObject())
            return
        }
        let start = Calendar.current.startOfDay(for: Date())
        pedometer.queryPedometerData(from: start, to: Date()) { _, _ in
            DispatchQueue.main.async { call.resolve(self.statusObject()) }
        }
    }

    /// Nothing to schedule on iPhone: the system keeps counting by itself.
    @objc func start(_ call: CAPPluginCall) {
        sync(call)
    }

    @objc func stop(_ call: CAPPluginCall) {
        call.resolve()
    }

    /// Steps for today and the 6 days before: { ok, days: { "2026-11-14": 4312 }, lastReading }
    @objc func sync(_ call: CAPPluginCall) {
        guard CMPedometer.isStepCountingAvailable() else {
            call.reject("This device has no step counter")
            return
        }
        let cal = Calendar.current
        let now = Date()
        let today = cal.startOfDay(for: now)
        let fmt = DateFormatter()
        fmt.calendar = Calendar(identifier: .gregorian)
        fmt.locale = Locale(identifier: "en_US_POSIX")
        fmt.dateFormat = "yyyy-MM-dd"

        var days: [String: Int] = [:]
        let lock = NSLock()
        let group = DispatchGroup()
        for i in 0..<7 {
            guard let from = cal.date(byAdding: .day, value: -i, to: today),
                  let nextDay = cal.date(byAdding: .day, value: 1, to: from) else { continue }
            let to = (i == 0) ? now : nextDay
            let key = fmt.string(from: from)
            group.enter()
            pedometer.queryPedometerData(from: from, to: to) { data, _ in
                if let d = data {
                    lock.lock()
                    days[key] = d.numberOfSteps.intValue
                    lock.unlock()
                }
                group.leave()
            }
        }
        group.notify(queue: .main) {
            call.resolve([
                "ok": !days.isEmpty,
                "days": days,
                "lastReading": Int(now.timeIntervalSince1970 * 1000),
            ])
        }
    }
}
