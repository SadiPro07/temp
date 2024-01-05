/* eslint-disable */ 
import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useMeetings } from '../../utils/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../navigations';


interface Meeting {
  id: number;
  title: string;
  description: string;
  date: string;
  is_scheduled: boolean;
  start_time: string;
  end_time: string;
  // Add other fields from your server response
}


interface ExtendedMeeting extends Meeting {
  meeting_time: number;
  // Add additional fields here
}




const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const { clearTokens } = useAuth();
  const { meetings, loading, error } = useMeetings();
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  useEffect(() => {
    const now = new Date();
    const upcoming: ExtendedMeeting[] = [];

    for (const meeting  of meetings as ExtendedMeeting[]) {
      const startTime = new Date(meeting.start_time);
      const endTime = new Date(meeting.end_time);

      if (now < startTime) {
        meeting.meeting_time = Math.floor((startTime.getTime() - now.getTime()) / 60000);
        upcoming.push(meeting);
      }
    }

    // Sort the upcoming meetings based on meeting_time
    upcoming.sort((a, b) => a.meeting_time - b.meeting_time);

    setUpcomingMeetings(upcoming);
  }, [meetings]);
  // console.log("mee", )
  
  const handleLogout = () => {
    // Clear tokens and navigate to the login screen
    clearTokens();
    navigation.navigate('Login');
  };

  const renderItem = ({ item } : { item: Meeting }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.time}>Start Time: {item.start_time.split(' ')[1]}</Text>
        <Text style={styles.time}>End Time: {item.end_time.split(' ')[1]}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.location}>Location: {item.is_scheduled ? "Scheduled" : "Not Scheduled"}</Text>
      <TouchableOpacity style={styles.joinButton} onPress={() => {}}>
        <Text style={styles.joinButtonText}>Join Meeting</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upcoming Meetings</Text>
      
      {error && <Text style={{ flex: 1, fontSize: 20, color: "red" }}>Something Went Wrong</Text>
      }
      {loading ? <ActivityIndicator style={{flex:1}} size={'large'} /> :
      <FlatList
      data={upcomingMeetings}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()} // Convert to string
      style={styles.cardList}
    />
    
      // <Text>dud</Text>
      }
<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardList: {
    marginTop: 16,
  },
  // card: {
  //   backgroundColor: 'white',
  //   borderRadius: 8,
  //   padding: 16,
  //   marginBottom: 16,
  //   elevation: 3,
  // },
  // title: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 8,
  // },
  // detailsContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
  // time: {
  //   fontSize: 14,
  //   color: '#666',
  // },
  // location: {
  //   fontSize: 14,
  //   color: '#666',
  // },
  logoutButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  joinButton: {
    backgroundColor: '#009688',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
