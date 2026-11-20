package za.hlaki.planner;

import android.content.Intent;
import android.provider.AlarmClock;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;

/**
 * Hands alarms over to the phone's own Clock app (Huawei Clock, Google Clock, ...),
 * so they ring loudly even if Hlaki's Planner is closed or killed by battery saving.
 */
@CapacitorPlugin(name = "Clock")
public class ClockPlugin extends Plugin {

    /** setAlarm({ hour, minute, label, days?: number[] (1=Sun..7=Sat), skipUi?: boolean }) */
    @PluginMethod
    public void setAlarm(PluginCall call) {
        Integer hour = call.getInt("hour");
        Integer minute = call.getInt("minute");
        if (hour == null || minute == null) {
            call.reject("hour and minute are required");
            return;
        }
        Intent intent = new Intent(AlarmClock.ACTION_SET_ALARM);
        intent.putExtra(AlarmClock.EXTRA_HOUR, hour);
        intent.putExtra(AlarmClock.EXTRA_MINUTES, minute);
        intent.putExtra(AlarmClock.EXTRA_MESSAGE, call.getString("label", "Hlaki's Planner"));
        intent.putExtra(AlarmClock.EXTRA_SKIP_UI, call.getBoolean("skipUi", false));
        intent.putExtra(AlarmClock.EXTRA_VIBRATE, true);
        JSArray days = call.getArray("days");
        if (days != null && days.length() > 0) {
            ArrayList<Integer> list = new ArrayList<>();
            for (int i = 0; i < days.length(); i++) {
                list.add(days.optInt(i));
            }
            intent.putExtra(AlarmClock.EXTRA_DAYS, list);
        }
        start(call, intent);
    }

    /** setTimer({ seconds, label }) - a countdown in the Clock app. */
    @PluginMethod
    public void setTimer(PluginCall call) {
        Integer seconds = call.getInt("seconds");
        if (seconds == null || seconds < 1) {
            call.reject("seconds is required");
            return;
        }
        Intent intent = new Intent(AlarmClock.ACTION_SET_TIMER);
        intent.putExtra(AlarmClock.EXTRA_LENGTH, seconds);
        intent.putExtra(AlarmClock.EXTRA_MESSAGE, call.getString("label", "Hlaki's Planner"));
        intent.putExtra(AlarmClock.EXTRA_SKIP_UI, true);
        start(call, intent);
    }

    /** Opens the Clock app's alarm list. */
    @PluginMethod
    public void showAlarms(PluginCall call) {
        start(call, new Intent(AlarmClock.ACTION_SHOW_ALARMS));
    }

    private void start(PluginCall call, Intent intent) {
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            getActivity().startActivity(intent);
            JSObject ret = new JSObject();
            ret.put("ok", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("No clock app on this phone can take alarms", e);
        }
    }
}
