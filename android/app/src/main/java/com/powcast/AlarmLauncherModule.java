package com.powcast;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.HashMap;
import java.util.Map;
import android.util.Log;

public class AlarmLauncherModule extends ReactContextBaseJavaModule {

    public AlarmLauncherModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AlarmLauncher";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @ReactMethod
    public final void setAlarm(String id, double timestamp, boolean inexact) {
        Log.i("ReactNativeAppLauncher", "AlarmReceiver: Launching: ");
        PendingIntent pendingIntent = createPendingIntent(id);

        long timestampLong = (long) timestamp;

        if (!inexact) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                getAlarmManager().setAlarmClock(new AlarmManager.AlarmClockInfo(timestampLong, pendingIntent),
                        pendingIntent);
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                getAlarmManager().setExact(AlarmManager.RTC_WAKEUP, timestampLong, pendingIntent);
            } else {
                getAlarmManager().set(AlarmManager.RTC_WAKEUP, timestampLong, pendingIntent);
            }
        } else {
            getAlarmManager().set(AlarmManager.RTC_WAKEUP, timestampLong, pendingIntent);
        }

        Context context = getReactApplicationContext();
    }

    @ReactMethod
    public final void clearAlarm(String id) {
        PendingIntent pendingIntent = createPendingIntent(id);
        getAlarmManager().cancel(pendingIntent);
    }

    private PendingIntent createPendingIntent(String id) {
        Context context = getReactApplicationContext();

        Intent intent = new Intent(context, AlarmReceiver.class);

        intent.setData(Uri.parse("id://" + id));
        intent.setAction(String.valueOf(id));

        return PendingIntent.getBroadcast(context, 0, intent, 0);
    }

    private AlarmManager getAlarmManager() {
        return (AlarmManager) getReactApplicationContext().getSystemService(Context.ALARM_SERVICE);
    }
}