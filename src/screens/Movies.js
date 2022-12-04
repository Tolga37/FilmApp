import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Dimensions,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomIcon from '../components/CustomIcon';
import {useNavigation} from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

Ionicons.loadFont();

const Movies = () => {
  const navigation = useNavigation();

  const flatListRef = useRef();

  const progressValue = useRef(new Animated.Value(0)).current;

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [searchWord, setSearchWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const progressBarTotalWidth = width - 44;
  const progressBarHeight = height * 0.015;

  const onRefresh = useCallback(() => {
    setRefreshing(false);
    if (searchWord) return fetchSearchMovies();
    fetchPopularMovies();
  }, [page, searchWord]);

  const fillProgressBar = newProgressValue => {
    Animated.timing(progressValue, {
      toValue: newProgressValue,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      if (newProgressValue == progressBarTotalWidth) return setIsLoading(false);
    });
  };

  const fetchPopularMovies = async () => {
    setIsLoading(true);
    await fetch(
      'https://api.themoviedb.org/3/movie/popular?api_key=9d01bf68c8a38201bda42bdc1253bf60&language=en-US&page=' +
        `${page}`,
    )
      .then(response => response.json())
      .then(response => {
        if (!response?.results) return Alert.alert('Bir Hata Oluştu');
        const newData = response.results;
        if (page == 1) {
          fillProgressBar(progressBarTotalWidth);
          return setData(newData);
        }
        setData(data => [...data, ...newData]);
      })
      .catch(() => Alert.alert('Bir Hata Oluştu'));
  };

  const fetchSearchMovies = async () => {
    if (!searchWord) return fetchPopularMovies();
    setIsLoading(true);
    await fetch(
      'https://api.themoviedb.org/3/search/movie?api_key=9d01bf68c8a38201bda42bdc1253bf60&query=' +
        `${searchWord}` +
        '&' +
        `${page}`,
    )
      .then(response => response.json())
      .then(response => {
        if (!response?.results) return Alert.alert('Bir Hata Oluştu');
        const newData = response.results;
        if (page == 1) {
          fillProgressBar(progressBarTotalWidth);
          return setData(newData);
        }
        setData(data => [...data, ...newData]);
      })
      .catch(() => Alert.alert('Bir Hata Oluştu'));
  };

  useEffect(() => {
    if (page == 1) {
      progressValue.setValue(0);
      fillProgressBar(progressBarTotalWidth / 2);
    }
    if (searchWord) {
      fetchSearchMovies();
    } else {
      fetchPopularMovies();
    }
  }, [page]);

  function renderItem({item}) {
    const onPress = () => {
      navigation.navigate('MoviesDetail', {id: item?.id});
    };

    return (
      <TouchableOpacity style={styles.movieCard} onPress={onPress}>
        <Image
          source={{
            uri:
              'https://image.tmdb.org/t/p/original/' + `${item?.poster_path}`,
          }}
          style={styles.movieCardImage}
        />
        <View style={styles.movieCardInfoSection}>
          <Text style={styles.movieCardText}>{item?.title} </Text>
          <View style={styles.movieCardRating}>
            <Text style={styles.movieCardText}>{item?.vote_average} </Text>
            <CustomIcon name={'star'} color={'#ffffff'} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const searchSubmit = () => {
    if (page == 1) {
      progressValue.setValue(0);
      fillProgressBar(progressBarTotalWidth / 2);
      if (searchWord) return fetchSearchMovies();
      fetchPopularMovies();
    }

    setPage(1);
    flatListRef.current.scrollToOffset({animated: true, offset: 0});
  };

  function ListFooterComponent() {
    return isLoading && <ActivityIndicator size="large" color="#999999" />;
  }

  const displayContent = () => {
    return (
      <View style={styles.content}>
        <View style={styles.searchBoxContainer}>
          <View style={styles.searchBox}>
            <CustomIcon name="search-outline" />
            <TextInput
              value={searchWord}
              onChangeText={setSearchWord}
              style={styles.searchInput}
              placeholder="Search movies"
              placeholderTextColor={'grey'}
              onSubmitEditing={searchSubmit}
            />
          </View>
        </View>
        <Text style={styles.title}>Movies</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          onEndReached={() => setPage(page => page + 1)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={ListFooterComponent}
          ref={flatListRef}
        />
      </View>
    );
  };

  const displayLoading = () => {
    return (
      <View style={styles.loading}>
        <View
          style={{
            borderRadius: progressBarTotalWidth,
            ...styles.progressBarContainer,
          }}>
          <Animated.View
            style={{
              width: progressValue,
              height: progressBarHeight,
              borderRadius: progressBarTotalWidth,
              ...styles.progressBar,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {page == 1 && isLoading ? displayLoading() : displayContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161620',
  },
  content: {
    flex: 1,
  },
  searchInput: {
    height: height / 20,
    marginLeft: 10,
    flex: 1,
    fontSize: 17,
    color: 'white',
  },
  searchBox: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    height: height / 20,
    width: width / 1.1,
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: '#2A2B37',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  movieCard: {
    backgroundColor: '#202D34',
    margin: 10,
    flex: 1,
    borderRadius: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  movieCardImage: {
    width: width / 3,
    height: height / 4.5,
    resizeMode: 'cover',
    margin: 10,
    borderRadius: 10,
  },
  movieCardInfoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 10,
  },
  movieCardText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    margin: 10,
  },
  movieCardRating: {
    backgroundColor: '#EEA72D',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: '800',
    margin: 15,
  },
  searchBoxContainer: {
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  progressBarContainer: {
    borderColor: '#fb8500',
    borderWidth: 2,
    marginHorizontal: 20,
  },
  progressBar: {
    backgroundColor: '#fb8500',
  },
});

export default Movies;
