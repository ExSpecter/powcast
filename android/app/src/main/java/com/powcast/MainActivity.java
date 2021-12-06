package com.powcast;

import com.facebook.react.ReactActivity;
import android.app.Activity;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nullable;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "powcast";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }

  public static class PowcastActivityDelegate extends ReactActivityDelegate {
      private static final String ALARM_ID_KEY = "alarmID";
      private Bundle mInitialProps = null;
      private final
      @Nullable
      Activity mActivity;

      public PowcastActivityDelegate(Activity activity, String mainComponentName) {
        super(activity, mainComponentName);
        this.mActivity = activity;
      }

      @Override
      protected void onCreate(Bundle savedInstanceState) {
        Bundle bundle = mActivity.getIntent().getExtras();
        if (bundle != null && bundle.containsKey(ALARM_ID_KEY)) {
            mInitialProps = new Bundle();
            mInitialProps.putString(ALARM_ID_KEY, bundle.getString(ALARM_ID_KEY));
        }
        super.onCreate(savedInstanceState);
      }

      @Override
      protected Bundle getLaunchOptions() {
        return mInitialProps;
      }
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new PowcastActivityDelegate(this, getMainComponentName());
  }
}
