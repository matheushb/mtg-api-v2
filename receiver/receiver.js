import amqplib from "amqplib";

async function watchQueues(queues) {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL || "", {
      heartbeat: 30,
    });

    const channel = await connection.createChannel();

    for (const queue of queues) {
      await channel.assertQueue(queue, { durable: true });

      console.log(`Aguardando mensagens na fila: ${queue}...`);

      channel.consume(queue, (msg) => {
        if (msg !== null) {
          try {
            console.log(
              `Mensagem recebida da fila "${queue}": ${msg.content.toString()}`
            );

            channel.ack(msg);
          } catch (error) {
            console.error(
              `Erro ao processar mensagem da fila "${queue}":`,
              error
            );

            channel.nack(msg, false, true);
          }
        }
      });
    }

    process.on("SIGINT", async () => {
      console.log("Encerrando consumidores...");
      await channel.close();
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("Erro ao configurar consumidores:", error);

    setTimeout(() => watchQueues(queues), 5000);
  }
}

const queuesToWatch = ["deck_import_queue"];
watchQueues(queuesToWatch);
