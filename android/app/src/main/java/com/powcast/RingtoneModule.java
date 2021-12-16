package com.powcast;

import android.net.Uri;
import android.os.Build;
import android.media.RingtoneManager;
import android.util.Log;
import android.database.Cursor;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Arrays;
import java.net.URI;
import java.util.ArrayList;

public class RingtoneModule extends ReactContextBaseJavaModule {

    public RingtoneModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Ringtones";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @ReactMethod
    public void listRingtones(Callback callback) {
        List<String> alarms = new ArrayList<String>();
        try {
            Context context = getReactApplicationContext();
            RingtoneManager ringtoneMgr = new RingtoneManager(context);
            ringtoneMgr.setType(RingtoneManager.TYPE_RINGTONE);

            Cursor alarmsCursor = ringtoneMgr.getCursor();
            int alarmsCount = alarmsCursor.getCount();
            if (alarmsCount == 0 && !alarmsCursor.moveToFirst()) {
                alarmsCursor.close();
                return;
            }

            while (!alarmsCursor.isAfterLast() && alarmsCursor.moveToNext()) {
                int currentPosition = alarmsCursor.getPosition();
                alarms.add(ringtoneMgr.getRingtoneUri(currentPosition).toString());
            }

            Log.i("PCL", "Alarms: " + alarms.get(0));
        } catch (Exception ex) {
            Log.e("PCL", "Error: " + ex);
            ex.printStackTrace();
        }

        callback.invoke(alarms.toArray());
    }
}