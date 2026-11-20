package za.hlaki.planner;

import android.Manifest;
import android.os.Build;

import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.concurrent.TimeUnit;

/**
 * Automatic step counting from the phone's own step sensor (no Google services needed).
 * JS: status(), requestPermission(), start(), stop(), sync().
 */
@CapacitorPlugin(name = "Steps", permissions = {@Permission(alias = "activity", strings = {Manifest.permission.ACTIVITY_RECOGNITION})})
public class StepsPlugin extends Plugin {
    private static final String WORK = "step-sampler";

    private boolean granted() {
        // before Android 10 the step counter needs no permission
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.Q || getPermissionState("activity") == PermissionState.GRANTED;
    }

    @PluginMethod
    public void status(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("available", StepSensor.available(getContext()));
        ret.put("granted", granted());
        call.resolve(ret);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (granted()) {
            status(call);
            return;
        }
        requestPermissionForAlias("activity", call, "permissionDone");
    }

    @PermissionCallback
    private void permissionDone(PluginCall call) {
        status(call);
    }

    /** Start background sampling (about every 15 min) and take a reading now. */
    @PluginMethod
    public void start(PluginCall call) {
        if (!granted()) {
            call.reject("Permission for physical activity was not given");
            return;
        }
        PeriodicWorkRequest req = new PeriodicWorkRequest.Builder(StepWorker.class, 15, TimeUnit.MINUTES).build();
        WorkManager.getInstance(getContext()).enqueueUniquePeriodicWork(WORK, ExistingPeriodicWorkPolicy.KEEP, req);
        sync(call);
    }

    @PluginMethod
    public void stop(PluginCall call) {
        WorkManager.getInstance(getContext()).cancelUniqueWork(WORK);
        call.resolve();
    }

    /** Take a fresh reading and return steps per day: { days: { "2026-11-14": 4312, ... }, ok, lastReading } */
    @PluginMethod
    public void sync(PluginCall call) {
        if (!granted()) {
            call.reject("Permission for physical activity was not given");
            return;
        }
        new Thread(() -> {
            boolean ok = StepSensor.sample(getContext());
            JSObject ret = new JSObject();
            ret.put("ok", ok);
            ret.put("days", StepStore.history(getContext()));
            ret.put("lastReading", StepStore.lastReadingTime(getContext()));
            call.resolve(ret);
        }).start();
    }
}
