/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.apache.tsfile.viewer.config;

import java.io.IOException;
import java.time.Duration;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * Web configuration for serving frontend static assets in embedded deployment mode.
 *
 * <p>This configuration enables the Spring Boot application to serve the Vue.js frontend from the
 * classpath resources, allowing for a single JAR deployment.
 *
 * <p>The frontend is served at the /view/* path, with SPA routing fallback to index.html.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

  /**
   * Configure resource handlers for serving static frontend assets.
   *
   * <p>Maps /view/** requests to classpath:/static/view/ directory. Implements SPA routing by
   * falling back to index.html for all non-existent resources (client-side routes).
   *
   * <p>Caching strategy follows the standard hashed-SPA pattern:
   *
   * <ul>
   *   <li>{@code /view/assets/**} — build output with content-hashed filenames (e.g. {@code
   *       index-BXJsXIsM.js}). Safe to cache forever ({@code max-age=1y, immutable}); a content
   *       change produces a new filename, so it can never go stale.
   *   <li>{@code index.html} and SPA routes — the entry point that references those hashes. Served
   *       {@code no-cache} (revalidate every load) so a new deployment is picked up immediately
   *       instead of being masked by a cached entry point for up to the cache period.
   * </ul>
   */
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // Handle favicon.ico at root path
    registry
        .addResourceHandler("/favicon.ico")
        .addResourceLocations("classpath:/static/view/")
        .setCachePeriod(86400); // 24 hours cache

    // Content-hashed build assets: immutable, cache for a year.
    registry
        .addResourceHandler("/view/assets/**")
        .addResourceLocations("classpath:/static/view/assets/")
        .setCacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable());

    // Frontend SPA entry + client-side routes: always revalidate so deploys take effect at once.
    registry
        .addResourceHandler("/view", "/view/", "/view/**")
        .addResourceLocations("classpath:/static/view/")
        .setCacheControl(CacheControl.noCache())
        .resourceChain(true)
        .addResolver(
            new PathResourceResolver() {
              @Override
              protected Resource getResource(String resourcePath, Resource location)
                  throws IOException {
                // Handle empty path (when accessing /view or /view/)
                if (resourcePath == null || resourcePath.isEmpty() || resourcePath.equals("/")) {
                  return new ClassPathResource("/static/view/index.html");
                }

                Resource requestedResource = location.createRelative(resourcePath);

                // If resource exists (e.g., JS/CSS/image files), return it
                if (requestedResource.exists() && requestedResource.isReadable()) {
                  return requestedResource;
                }

                // Otherwise, fall back to index.html for SPA client-side routing
                return new ClassPathResource("/static/view/index.html");
              }
            });
  }

  /**
   * Configure view controllers.
   *
   * <p>Redirects root path "/" to "/view/" for convenience.
   */
  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    // Redirect root to /view/
    registry.addRedirectViewController("/", "/view/");
  }
}
