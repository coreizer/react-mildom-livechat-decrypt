import React, { useEffect, useRef } from "react";
import { useList } from "react-use";
import xxtea from "xxtea-node";

import {
  AppShell,
  Container,
  Card,
  Text,
  Badge,
  Group,
  Mark,
  Loader,
  Title,
  Avatar,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import * as dayjs from "dayjs";
import "dayjs/locale/ja";

dayjs.locale("ja-jp");

// ミルダム公開鍵
const PUBLIC_KEY = "32l*!i1^l56e%$xnm1j9i@#$cr&";

const App = () => {
  const form = useForm({
    initialValues: {
      channel_id: 12656416,
    },
  });

  console.log(form.getInputProps("channel_id").value);
  const [items, { push }] = useList();
  const ws = useRef(
    new WebSocket(
      `wss://jp-room1.mildom.com/?roomId=${
        form.getInputProps("channel_id").value
      }`
    )
  );

  // 初期値: blog型 から arraybuffer に変更します。
  ws.current.binaryType = "arraybuffer";

  useEffect(() => {
    const enterRoomJson = JSON.stringify({
      userId: 0,
      level: 1,
      userName: "guest133700",
      guestId: "pc-gp-e77d4d7b-9d6b-418b-8303-48e5a882d014",
      roomId: form.getInputProps("channel_id").value,
      reqId: 1,
      cmd: "enterRoom",
      reConnect: 0,
      nobleLevel: 0,
      avatarDecortaion: 0,
      enterroomEffect: 0,
      nobleClose: 0,
      nobleSeatClose: 0,
    });

    const base64 = xxtea.encrypt(
      xxtea.toBytes(enterRoomJson),
      xxtea.toBytes(PUBLIC_KEY)
    );

    const metadata = new ArrayBuffer(4);
    new DataView(metadata).setUint32(0, base64.length, false);

    const buf = new Uint8Array(8 + base64.length);
    buf.set([0, 4, 1, 1], 0);
    buf.set(new Uint8Array(metadata), 4);
    buf.set(base64, 8);

    console.log("buffer:", buf, buf.byteLength);

    ws.current.onopen = () => {
      console.log("Websocket Open!");
      ws.current.send(buf);
    };

    ws.current.onmessage = (response) => {
      if (response.data instanceof ArrayBuffer) {
        const decrypted = xxtea.decrypt(
          new Uint8Array(response.data).slice(8),
          xxtea.toBytes(PUBLIC_KEY)
        );

        const jsonString = JSON.parse(xxtea.toString(decrypted));
        push(jsonString);
      }
    };
  });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 100,
        breakpoint: "sm",
      }}
      padding="md"
    >
      <AppShell.Header pl={10} pt={10}>
        <Group>
          <Avatar radius="sm" src="./img/logo_dark.png" />
          <Text
            fw={900}
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan", deg: 119 }}
          >
            ライブチャット
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container>
          <Title order={3} mb="sm">
            ライブチャット
          </Title>

          {items.length < 0 ? (
            <Loader color="blue" size="lg" />
          ) : (
            items.map((item, index) => {
              if (item.cmd != "onChat") return;

              console.log(item);

              return (
                <Card
                  key={index}
                  shadow="sm"
                  padding="lg"
                  mt="sm"
                  radius="md"
                  withBorder
                >
                  <Group justify="space-between" mb="xs">
                    <Text size="sm">
                      <Mark mr={5}>ユーザー名</Mark> {item.userName}
                    </Text>
                    <Badge color="blue">
                      作成日 {dayjs(item.time * 1).format("YYYY年M月D日 H:m:s")}
                    </Badge>
                  </Group>

                  <Text size="sm" c="dimmed">
                    <Mark mr={5}>メッセージ</Mark> {item.msg}
                  </Text>
                </Card>
              );
            })
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
