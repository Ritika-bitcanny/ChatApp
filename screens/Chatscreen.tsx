import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Chatscreen = ({ route, navigation }: any) => {
  const { chatId, otherUserId } = route.params;
  const currentUser = auth().currentUser ;

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [otherUserEmail, setOtherUserEmail] = useState('');

  // Fetch  emails 
  useEffect(() => {
    const fetchNames = async () => {
      if(!currentUser) return;
      const currentSnap = await database().ref(`/users/${currentUser.uid}`).once('value');
      if (currentSnap.exists()) setCurrentUserEmail(currentSnap.val().email);

      const otherSnap = await database().ref(`/users/${otherUserId}`).once('value');
      if (otherSnap.exists()) {
        setOtherUserEmail(otherSnap.val().email);
        const name = otherSnap.val().email.split('@')[0];
        navigation.setOptions({ title: name.charAt(0).toUpperCase() + name.slice(1) });
      }
    };

    fetchNames();
  }, [currentUser]);

 
  useEffect(() => {
    const chatRef = database().ref(`/messages/${chatId}`).orderByKey();

    chatRef.on('value', snapshot => {
      const data = snapshot.val();
      const msgList: any[] = [];

      if (data) {
        Object.entries(data).forEach(([msgId, msg]: any) => {
          msgList.push({
            id: msgId,
            sender: msg.sender,
            text: msg.text,
          });
        });
      }

      setMessages(msgList);
    });

    return () => chatRef.off('value');
  }, [chatId]);

 
  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageRef = database().ref(`/messages/${chatId}`).push();
    messageRef.set({
      sender: currentUser.uid,
      text: newMessage,
    });

    setNewMessage('');
  };


  const getNameFromUid = (uid: string) => {
    if (uid === currentUser.uid) return getNameFromEmail(currentUserEmail);
    return getNameFromEmail(otherUserEmail);
  };

  const getNameFromEmail = (email: string) => {
    return email ? email.split('@')[0] : '';
  };

  const renderMessage = ({ item }: any) => (
    <View
      style={[
        styles.messageItem,
        item.sender === currentUser.uid ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.senderText}>{getNameFromUid(item.sender)}</Text>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingBottom: 10 }}
          inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type message"
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.button}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chatscreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  messageItem: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
  },
  myMessage: {
    backgroundColor: 'lightpink',
    alignSelf: 'flex-end',
    borderRadius:6,
  },
  otherMessage: {
    backgroundColor: 'lightgray',
    alignSelf: 'flex-start',
  },
  senderText: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingTop: 5,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  button: {
    backgroundColor: '#FF69B4',
    padding: 10,
    borderRadius: 5,
  },
});

