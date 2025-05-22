package com.guoaili.zackback.util;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import com.guoaili.zackback.model.ProgressTracker;

@Component
public class SpringContextUtil implements ApplicationContextAware {
    private static ApplicationContext context;
    private static ProgressTracker progressTracker = new ProgressTracker();

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        context = applicationContext;
    }

    public static ApplicationContext getContext() {
        return context;
    }

    public static ProgressTracker getProgressTracker() {
        return progressTracker;
    }
}
