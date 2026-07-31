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

/**
 * Tailwind configuration.
 *
 * Semantic colors are wired to the CSS variables declared in
 * src/styles/tokens.css so that light/dark switching is a single
 * class toggle on <html> instead of a duplicated palette.
 */

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          deep: "var(--primary-deep)",
          light: "var(--primary-light)",
        },
        "bg-app": "var(--bg-app)",
        "bg-card": "var(--bg-card)",
        "bg-subtle": "var(--bg-subtle)",
        "text-heading": "var(--text-heading)",
        "text-label": "var(--text-label)",
        "text-body": "var(--text-body)",
        "border-default": "var(--border-default)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
      borderRadius: {
        control: "var(--radius-control)",
        card: "var(--radius-card)",
      },
      boxShadow: {
        ambient: "var(--shadow-ambient)",
        card: "var(--shadow-card)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
    },
  },
  plugins: [],
};
