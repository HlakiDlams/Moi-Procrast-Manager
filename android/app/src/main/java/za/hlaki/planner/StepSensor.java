package za.hlaki.planner;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.SystemClock;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/** Reads the hardware step counter once. Must be called off the main thread (it waits). */
public final class StepSensor {
    private StepSensor() {}

    public static boolean available(Context ctx) {
        SensorManager sm = (SensorManager) ctx.getSystemService(Context.SENSOR_SERVICE);
        return sm != null && sm.getDefaultSensor(Sensor.TYPE_STEP_COUNTER) != null;
    }

    /** Current counter value (steps since restart), or -1 if it could not be read in time. */
    public static float readOnce(Context ctx, long timeoutMs) {
        SensorManager sm = (SensorManager) ctx.getSystemService(Context.SENSOR_SERVICE);
        if (sm == null) return -1;
        Sensor sensor = sm.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        if (sensor == null) return -1;
        final float[] value = {-1};
        final CountDownLatch latch = new CountDownLatch(1);
        SensorEventListener listener = new SensorEventListener() {
            @Override
            public void onSensorChanged(SensorEvent event) {
                if (value[0] < 0) {
                    value[0] = event.values[0];
                    latch.countDown();
                }
            }

            @Override
            public void onAccuracyChanged(Sensor s, int accuracy) {}
        };
        sm.registerListener(listener, sensor, SensorManager.SENSOR_DELAY_NORMAL);
        try {
            latch.await(timeoutMs, TimeUnit.MILLISECONDS);
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        } finally {
            sm.unregisterListener(listener);
        }
        return value[0];
    }

    /** Read the sensor and store it. Returns false if no reading came in. */
    public static boolean sample(Context ctx) {
        float v = readOnce(ctx, 5000);
        if (v < 0) return false;
        long now = System.currentTimeMillis();
        long boot = now - SystemClock.elapsedRealtime();
        StepStore.record(ctx, v, now, boot);
        return true;
    }
}
