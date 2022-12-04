import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {detail} from '../redux/action/detailAction';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const MoviesDetail = props => {
  const {route} = props;
  const {params} = route;
  const movieId = params.id;

  const dispatch = useDispatch();
  const stateDetail = useSelector(state => state.detail.detail);

  const progressBarTotalWidth = width - 44;
  const progressBarHeight = height * 0.015;

  const progressValue = useRef(new Animated.Value(0)).current;

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetailData = async () => {
    await fetch(
      'https://api.themoviedb.org/3/movie/' +
        `${movieId}` +
        '?api_key=9d01bf68c8a38201bda42bdc1253bf60&language=en-US',
    )
      .then(response => response.json())
      .then(response => {
        setData(response);
        dispatch(detail(response));
      })
      .catch(() => Alert.alert('Bir Hata Oluştu'));
    fillProgressBar(progressBarTotalWidth);
  };

  const handleGetDetailData = () => {
    if (stateDetail?.length >= 1) {
      const localeData = stateDetail.find(key => key.id == movieId);
      if (!localeData) return fetchDetailData();
      setData(localeData);
      return fillProgressBar(progressBarTotalWidth);
    }
    fetchDetailData();
  };

  useEffect(() => {
    fillProgressBar(progressBarTotalWidth / 2);
    handleGetDetailData();
  }, []);

  const Content = () => {
    return (
      <ScrollView style={styles.container}>
        <Image
          source={{
            uri:
              'https://image.tmdb.org/t/p/original/' + `${data?.poster_path}`,
          }}
          style={styles.image}
          resizeMethod="resize"
          resizeMode="cover"
        />
        <View style={styles.taglineView}>
          <Text style={styles.movieDetailText}>{data?.tagline} </Text>
        </View>
        <View style={styles.detailView}>
          <Text style={styles.movieDetailText}>
            Date: {data?.release_date}{' '}
          </Text>
          <Text style={styles.movieDetailText}>
            Vote: {data?.vote_average}{' '}
          </Text>
          <Text style={styles.movieDetailText}>
            Language: {data?.original_language}
          </Text>
          <Text style={styles.movieDetailText}>
            Popularity: {data?.popularity}{' '}
          </Text>
          <Text style={styles.movieDetailText}>Overview: </Text>
          <Text style={styles.movieDetailText}>{data?.overview} </Text>
        </View>
      </ScrollView>
    );
  };

  const fillProgressBar = newProgressValue => {
    Animated.timing(progressValue, {
      toValue: newProgressValue,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      if (newProgressValue == progressBarTotalWidth) return setIsLoading(false);
    });
  };

  const Loading = () => {
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
      {isLoading ? <Loading /> : <Content />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161620',
  },
  image: {
    width: '100%',
    height: height / 1.5,
  },
  movieDetailText: {
    fontSize: 17,
    color: 'grey',
    fontWeight: '800',
    marginBottom: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  detailView: {
    padding: 10,
    alignItems: 'flex-start',
  },
  taglineView: {
    alignItems: 'center',
    marginTop: '3%',
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

export default MoviesDetail;
