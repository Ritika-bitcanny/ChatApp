import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Chatlist = ({ navigation }: any) => {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [existingChats, setExistingChats] = useState<any[]>([]);
  const currentUser = auth().currentUser;

  // fetch all users
  useEffect(() => {
    const usersRef = database().ref('/users');
    usersRef.on('value', snapshot => {
      const users = snapshot.val();
      const userList: any[] = [];

      if (users) {
        Object.entries(users).forEach(([uid, user]: any) => {
          if (uid !== currentUser.uid) {
            userList.push({ uid, email: user.email });
          }
        });
      }
      setAllUsers(userList);
    });

    return () => usersRef.off('value');
  }, []);

  // fetch existing chats 
  useEffect(() => {
    const chatsRef = database().ref('/chats');
    chatsRef.on('value', snapshot => {
      const chats = snapshot.val();
      const userChats: any[] = [];

      if (chats) {
        Object.entries(chats).forEach(([chatId, chat]: any) => {
          if (chat.users && chat.users[currentUser.uid]) {
            const otherUid = Object.keys(chat.users).find(uid => uid !== currentUser.uid);
            const otherUser = allUsers.find(u => u.uid === otherUid);

            if (otherUser) {
              userChats.push({
                chatId,
                otherUid,
                name: getNameFromEmail(otherUser.email),
              });
            }
          }
        });
      }

      setExistingChats(userChats);
    });

    return () => chatsRef.off('value');
  }, [allUsers]);

 
  const filteredUsers = allUsers.filter(user =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );
 
  const getNameFromEmail = (email: string) => {
    const a= email.split('@')[0]; 
    return a.charAt(0).toUpperCase() + a.slice(1);
  };

  const startchat = (otherUid: any) => {
    const chatsRef = database().ref('/chats');

    chatsRef.once('value').then(snapshot => {
      const chats = snapshot.val();
      let existingChatId = null;

      if (chats) {
        Object.entries(chats).forEach(([chatId, chat]: any) => {
          if (chat.users && chat.users[currentUser.uid] && chat.users[otherUid]) {
            existingChatId = chatId;
          }
        });
      }

      if (existingChatId) {
        navigation.navigate('Chatscreen', { chatId: existingChatId, otherUserId: otherUid });
      } else {
        const newChatRef = chatsRef.push();
        newChatRef.set({
          users: {
            [currentUser.uid]: true,
            [otherUid]: true,
          },
        });
        navigation.navigate('Chatscreen', { chatId: newChatRef.key, otherUserId: otherUid });
      }
    });
  };

  const renderExistingChat = ({ item }: any) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chatscreen', { chatId: item.chatId, otherUserId: item.otherUid })}
    >
      <Text style={styles.sectionTitle}> {item.name}</Text>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }: any) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => startchat(item.uid)}>
      <Text>{item.email}</Text>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => navigation.replace('Login'))
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search users..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      {search.length > 0 && (
        <FlatList data={filteredUsers} keyExtractor={item => item.uid} renderItem={renderUserItem}  />
      )}

      {/* <Text style={styles.sectionTitle}>Existing Chats</Text> */}
      <FlatList data={existingChats} keyExtractor={item => item.chatId} renderItem={renderExistingChat} />

      <TouchableOpacity style={styles.button} onPress={handleLogout} > 
        <Text style={styles.text}>Logout</Text>
        </TouchableOpacity> 
    </View>
  );
};

export default Chatlist;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 ,backgroundColor:'lightpink'},
  chatItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  button:{backgroundColor:'pink',alignItems:'center',justifyContent:'center'},
  text:{padding:10,fontWeight:800}
});

