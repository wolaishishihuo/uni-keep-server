import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, Producer, Partitioners } from 'kafkajs';
import { ThirdPartyConfig } from '@src/config/third-party.config';
import { SUBSCRIBER_FIXED_FN_REF_MAP, SUBSCRIBER_FN_REF_MAP, SUBSCRIBER_OBJ_REF_MAP } from './kafka.decorator';
import { KafkaPayload } from './kafka.message';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private fixedConsumer: Consumer;
  private readonly consumerSuffix = '-' + Math.floor(Math.random() * 100000);

  // constructor(private kafkaConfig: KafkaConfig) {
  //   this.kafka = new Kafka({
  //     clientId: this.kafkaConfig.clientId,
  //     brokers: this.kafkaConfig.brokers,
  //   });
  //   this.producer = this.kafka.producer();
  //   this.consumer = this.kafka.consumer({
  //     groupId: this.kafkaConfig.groupId + this.consumerSuffix,
  //   });
  //   this.fixedConsumer = this.kafka.consumer({
  //     groupId: this.kafkaConfig.groupId,
  //   });
  // }

  constructor(
    @Inject('KafkaClient') private kafkaClient: Kafka,
    private readonly configService: ConfigService
  ) {}

  async generateKafkaClient() {
    const kafkaConfig = this.configService.get<ThirdPartyConfig>('thirdParty')!.kafka;
    const groupId = kafkaConfig.groupId;
    this.kafka = this.kafkaClient;
    this.producer = this.kafka?.producer({
      createPartitioner: Partitioners.LegacyPartitioner
    });
    this.consumer = this.kafka?.consumer({
      groupId: groupId + this.consumerSuffix
    });
    this.fixedConsumer = this.kafka?.consumer({
      groupId: groupId
    });

    // 建立连接
    await this.connect();

    SUBSCRIBER_FN_REF_MAP.forEach((functionRef, topic) => {
      // attach the function with kafka topic name
      this.bindAllTopicToConsumer(functionRef, topic);
    });

    SUBSCRIBER_FIXED_FN_REF_MAP.forEach((functionRef, topic) => {
      // attach the function with kafka topic name
      this.bindAllTopicToFixedConsumer(functionRef, topic);
    });

    await this.consumer?.run({
      eachMessage: async ({ topic, message }) => {
        const functionRef = SUBSCRIBER_FN_REF_MAP.get(topic);
        const object = SUBSCRIBER_OBJ_REF_MAP.get(topic);
        // bind the subscribed functions to topic
        await functionRef.apply(object, [message.value.toString()]);
      }
    });

    await this.fixedConsumer?.run({
      eachMessage: async ({ topic, message }) => {
        const functionRef = SUBSCRIBER_FIXED_FN_REF_MAP.get(topic);
        const object = SUBSCRIBER_OBJ_REF_MAP.get(topic);
        // bind the subscribed functions to topic
        await functionRef.apply(object, [message.value.toString()]);
      }
    });
  }

  async connect() {
    await this.producer?.connect();
    await this.consumer?.connect();
    await this.fixedConsumer?.connect();
  }

  async disconnect() {
    await this.producer?.disconnect();
    await this.consumer?.disconnect();
    await this.fixedConsumer?.disconnect();
  }

  async bindAllTopicToConsumer(callback, _topic) {
    await this.consumer?.subscribe({ topic: _topic, fromBeginning: true });
  }

  async bindAllTopicToFixedConsumer(callback, _topic) {
    await this.fixedConsumer?.subscribe({
      topic: _topic,
      fromBeginning: true
    });
  }

  async sendMessage(kafkaTopic: string, kafkaMessage: KafkaPayload) {
    if (!this.kafka) {
      await this.generateKafkaClient();
    }
    const metadata = await this.producer
      ?.send({
        topic: kafkaTopic,
        messages: [{ value: JSON.stringify(kafkaMessage) }]
      })
      .catch((e) => console.error(e.message, e));
    return metadata?.[0];
  }
}
