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
package org.apache.iotdb.ui;

import com.alibaba.fastjson.serializer.SerializeConfig;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.alibaba.fastjson.serializer.ToStringSerializer;
import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.EnableAsync;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@EnableAsync
public class Application {

  public static void main(String[] args) throws Exception {
    SpringApplication.run(Application.class, args);
  }

  @SuppressWarnings("deprecation")
  @Bean
  public HttpMessageConverters fastJsonHttpMessageConverters() {

    // 创建fastJson消息转换器
    FastJsonHttpMessageConverter fastJsonConverter = new FastJsonHttpMessageConverter();
    // 创建配置类
    FastJsonConfig fastJsonConfig = new FastJsonConfig();
    // 过滤并修改配置返回内容
    fastJsonConfig.setSerializerFeatures(
        // List字段如果为null,输出为[],而非null
        SerializerFeature.WriteNullListAsEmpty
        // 字符类型字段如果为null,输出为"",而非null
        // SerializerFeature.WriteNullStringAsEmpty,
        // Boolean字段如果为null,输出为false,而非null
        // SerializerFeature.WriteNullBooleanAsFalse,
        // 消除循环引用特性
        // SerializerFeature.DisableCircularReferenceDetect,
        // 是否输出值为null的字段,默认为false。
        // SerializerFeature.WriteMapNullValue
        );
    // 处理中文乱码问题
    List<MediaType> fastMediaTypes = new ArrayList<>();
    fastMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
    fastJsonConverter.setSupportedMediaTypes(fastMediaTypes);

    // 处理Long型属性序列化后精度问题
    SerializeConfig serializeConfig = SerializeConfig.globalInstance;
    serializeConfig.put(BigInteger.class, ToStringSerializer.instance);
    serializeConfig.put(Long.class, ToStringSerializer.instance);
    serializeConfig.put(Long.TYPE, ToStringSerializer.instance);
    fastJsonConfig.setSerializeConfig(serializeConfig);

    fastJsonConverter.setFastJsonConfig(fastJsonConfig);

    //		HttpMessageConverter<?> converter = fastJsonConverter;
    return new HttpMessageConverters(fastJsonConverter);
  }
}
