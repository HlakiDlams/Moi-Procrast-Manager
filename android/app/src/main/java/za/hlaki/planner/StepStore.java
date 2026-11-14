package za.hlaki.planner;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.Locale;

/**
 * Turns the phone's step counter (total steps since the last restart) into steps per day.
 * Every reading adds the difference since the previous reading to the right day(s):
 *  - after a restart the counter starts again from 0, so the new value IS the difference
 *  - if a gap crosses midnight, the steps are split between the days by time
 */
public final class StepStore {
    private static final String PREFS = "steps";
    private static final String KEY_DAYS = "days"; // JSON {"2026-11-14": 4312, ...}
    private static final String KEY_LAST_VALUE = "lastValue";
    private static final String KEY_LAST_TIME = "lastTime";
    private static final String KEY_BOOT = "bootTime";
    private static final int KEEP_DAYS = 120;

    private StepStore() {}

    static String dayKey(long millis) {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date(millis));
    }

    /** Start of the next local day after `millis`. */
    private static long nextMidnight(long millis) {
        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(millis);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        c.add(Calendar.DAY_OF_MONTH, 1);
        return c.getTimeInMillis();
    }

    /** Record one sensor reading. Synchronized: the plugin and the background worker can both call this. */
    public static synchronized void record(Context ctx, float value, long now, long bootTime) {
        SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        JSONObject days = load(p);
        if (!p.contains(KEY_LAST_VALUE)) {
            // first ever reading: nothing to compare with yet, so today starts at 0
            try {
                if (!days.has(dayKey(now))) days.put(dayKey(now), 0);
            } catch (Exception ignored) {
            }
            save(p, days, value, now, bootTime);
            return;
        }
        float lastValue = p.getFloat(KEY_LAST_VALUE, 0f);
        long lastTime = p.getLong(KEY_LAST_TIME, now);
        long lastBoot = p.getLong(KEY_BOOT, bootTime);

        boolean restarted = Math.abs(bootTime - lastBoot) > 60_000 || value < lastValue;
        float delta = restarted ? value : value - lastValue;
        if (delta < 0) delta = 0;
        if (lastTime > now) lastTime = now;

        // spread the steps over the day(s) between the two readings, in proportion to time
        long span = Math.max(1, now - lastTime);
        long t = lastTime;
        float given = 0;
        while (t < now) {
            long end = Math.min(nextMidnight(t), now);
            float part = (end >= now) ? delta - given : delta * (end - t) / (float) span;
            add(days, dayKey(t), part);
            given += part;
            t = end;
        }
        if (lastTime == now) add(days, dayKey(now), delta);
        save(p, days, value, now, bootTime);
    }

    private static void add(JSONObject days, String key, float steps) {
        try {
            days.put(key, days.optDouble(key, 0) + steps);
        } catch (Exception ignored) {
        }
    }

    private static JSONObject load(SharedPreferences p) {
        try {
            return new JSONObject(p.getString(KEY_DAYS, "{}"));
        } catch (Exception e) {
            return new JSONObject();
        }
    }

    private static void save(SharedPreferences p, JSONObject days, float value, long now, long bootTime) {
        // forget very old days
        String cutoff = dayKey(now - KEEP_DAYS * 86_400_000L);
        Iterator<String> it = days.keys();
        java.util.List<String> old = new java.util.ArrayList<>();
        while (it.hasNext()) {
            String k = it.next();
            if (k.compareTo(cutoff) < 0) old.add(k);
        }
        for (String k : old) days.remove(k);
        p.edit()
            .putString(KEY_DAYS, days.toString())
            .putFloat(KEY_LAST_VALUE, value)
            .putLong(KEY_LAST_TIME, now)
            .putLong(KEY_BOOT, bootTime)
            .apply();
    }

    /** All stored days, rounded to whole steps. */
    public static synchronized JSONObject history(Context ctx) {
        JSONObject days = load(ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE));
        JSONObject out = new JSONObject();
        Iterator<String> it = days.keys();
        while (it.hasNext()) {
            String k = it.next();
            try {
                out.put(k, Math.round(days.optDouble(k, 0)));
            } catch (Exception ignored) {
            }
        }
        return out;
    }

    public static synchronized long lastReadingTime(Context ctx) {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getLong(KEY_LAST_TIME, 0);
    }
}
