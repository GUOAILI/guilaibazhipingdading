package com.guoaili.zackback.model;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ProgressTracker {
    private final Map<String, AtomicInteger> progressMap = new ConcurrentHashMap<>();

    public void setProgress(String key, int percentage) {
        progressMap.computeIfAbsent(key, k -> new AtomicInteger(0)).set(percentage);
    }

    public int getProgress(String key) {
        return progressMap.getOrDefault(key, new AtomicInteger(0)).get();
    }

    public int getTotalProgress() {
        return progressMap.values().stream()
                .mapToInt(AtomicInteger::get)
                .max()
                .orElse(0);
    }

    public void reset(String key) {
        progressMap.remove(key);
    }
}