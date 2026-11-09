package za.hlaki.planner;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ClockPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
