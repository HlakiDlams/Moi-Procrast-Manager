package za.hlaki.planner;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

/** Runs about every 15 minutes (Android decides the exact time) to sample the step counter. */
public class StepWorker extends Worker {
    public StepWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);
    }

    @NonNull
    @Override
    public Result doWork() {
        try {
            StepSensor.sample(getApplicationContext());
        } catch (Exception ignored) {
            // never crash in the background; we'll try again next time
        }
        return Result.success();
    }
}
