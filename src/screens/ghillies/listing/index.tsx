import React, {useCallback} from "react";
import MainContainer from "../../../components/containers/MainContainer";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import {Center, Column, HStack, ScrollView, Text, View} from "native-base";
import {FlatList} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import {Feather, Ionicons} from "@expo/vector-icons";
import styles from "./styles";
import {Colors} from "../../../shared/styles";
import {useNavigation} from "@react-navigation/native";
import GhillieRow from "../../../components/ghillie-row";
import GhillieService from "../../../shared/services/ghillie.service";
import {GhillieDetailDto} from "../../../shared/models/ghillies/ghillie-detail.dto";
import {useStateWithCallback} from "../../../shared/hooks";
import {colorsVerifyCode} from '../../../components/colors';
import GhillieCardV2 from '../../../components/ghillie-card-v2';
import RegularText from '../../../components/texts/regular-texts';

function GhillieListingHeader({isVerifiedMilitary, isAdmin}) {
  const navigation: any = useNavigation();
  
  const handleCreateNavigate = useCallback(() => {
    navigation.navigate("GhillieCreate");
  }, [navigation]);
  
  const handleSearchNavigate = useCallback(() => {
    navigation.navigate("GhillieSearch");
  }, [navigation]);
  
  return (
    <HStack style={{marginTop: 5}}>
      <Column width="12%">
        {(isVerifiedMilitary || isAdmin) && (
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 40,
              marginBottom: 8,
              paddingLeft: 20
            }}
            onPress={() => handleCreateNavigate()}
          >
            <Ionicons name="create-outline" size={30} color={colorsVerifyCode.secondary}/>
          </TouchableOpacity>
        )}
      </Column>
      <Column width="76%">
        {/*<StyledSearchInput*/}
        {/*  placeholder="Search for a Ghillie"*/}
        {/*  value={searchText}*/}
        {/*  onChangeText={setSearchText}*/}
        {/*  style={{*/}
        {/*    padding: 0,*/}
        {/*    flex: 1,*/}
        {/*    marginRight: 5,*/}
        {/*    marginLeft: 5,*/}
        {/*    color: Colors.white*/}
        {/*  }}*/}
        {/*  returnKeyType={"search"}*/}
        {/*  onSubmitEditing={onEnterPress}*/}
        {/*/>*/}
      </Column>
      <Column width="12%">
        {/*{searchText.length > 0 && (*/}
        {/*  <TouchableOpacity*/}
        {/*    style={{*/}
        {/*      justifyContent: "center",*/}
        {/*      alignItems: "center",*/}
        {/*      height: 40,*/}
        {/*      marginBottom: 8,*/}
        {/*      paddingRight: 20*/}
        {/*    }}*/}
        {/*    onPress={() => clearSearch()}*/}
        {/*  >*/}
        {/*    <MaterialIcons name="clear" size={30} color={colorsVerifyCode.secondary}/>*/}
        {/*  </TouchableOpacity>*/}
        {/*)}*/}
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            marginBottom: 8,
            paddingRight: 20
          }}
          onPress={() => handleSearchNavigate()}
        >
          <Feather name="search" size={30} color={colorsVerifyCode.secondary}/>
        </TouchableOpacity>
      </Column>
    </HStack>
  );
}

function GhillieListingScreen() {
  
  const [userGhillies, setUserGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);
  const [popularGhilliesByMembers, setPopularGhilliesByMembers] = useStateWithCallback<GhillieDetailDto[]>([]);
  const [trendingGhillies, setTrendingGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);
  const [newGhillies, setNewGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);
  
  const [isLoadingUserGhillies, setIsLoadingUserGhillies] = useStateWithCallback(false);
  const [isLoadingPopularGhillies, setIsLoadingPopularGhillies] = useStateWithCallback(false);
  const [isLoadingTrendingGhillies, setIsLoadingTrendingGhillies] = useStateWithCallback(false);
  const [isLoadingNewGhillies, setIsLoadingNewGhillies] = useStateWithCallback(false);
  
  const [isVerifiedMilitary, isAdmin] = useSelector(
    (state: IRootState) => [
      state.authentication.isVerifiedMilitary,
      state.authentication.isAdmin
    ]);
  
  const navigation: any = useNavigation();
  
  React.useEffect(() => {
    const initialLoad = navigation.addListener('focus', async () => {
      getMyGhillies();
      getPopularGhillies();
      getPopularGhilliesByTrendingPosts();
      getNewestGhillies();
    });
    
    return initialLoad;
  }, [navigation]);
  
  const getMyGhillies = useCallback(() => {
    setIsLoadingUserGhillies(true);
    GhillieService.getMyGhillies()
      .then((response) => {
        setUserGhillies(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoadingUserGhillies(false);
      });
    
  }, []);
  
  const getPopularGhillies = useCallback(() => {
    setIsLoadingPopularGhillies(true);
    GhillieService.getPopularGhilliesByMembers(10)
      .then((response) => {
        setPopularGhilliesByMembers(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoadingPopularGhillies(false);
      });
  }, []);
  
  const getPopularGhilliesByTrendingPosts = useCallback(() => {
    setIsLoadingTrendingGhillies(true);
    GhillieService.getPopularGhilliesByTrendingPosts(10)
      .then((response) => {
        setTrendingGhillies(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoadingTrendingGhillies(false);
      });
  }, []);
  
  const getNewestGhillies = useCallback(() => {
    setIsLoadingNewGhillies(true);
    GhillieService.getNewestGhillies(10)
      .then((response) => {
        setNewGhillies(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoadingNewGhillies(false);
      });
  }, []);
  
  return (
    <MainContainer style={[styles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <GhillieListingHeader
          isVerifiedMilitary={isVerifiedMilitary}
          isAdmin={isAdmin}
        />
        
        <View mt={5}>
          <RegularText style={{
            marginLeft: 15,
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10
          }}>
            <RegularText style={{
              marginLeft: 15,
              fontSize: 20,
              fontStyle: "italic",
              fontWeight: "bold",
              color: colorsVerifyCode.secondary,
              marginBottom: 10
            }}>
              My{" "}
            </RegularText>
            Ghillies
          </RegularText>
          <GhillieRow
            ghillieList={userGhillies}
            onPress={ghillie => {
              navigation.navigate("GhillieDetail", {ghillieId: ghillie.id});
            }}
          />
        </View>
        
        <View mb={40}>
          <View style={styles.popularContainer}>
            <RegularText style={{
              marginLeft: 15,
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10
            }}>
              <RegularText style={{
                marginLeft: 15,
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: "bold",
                color: colorsVerifyCode.secondary,
                marginBottom: 10
              }}>
                Popular{" "}
              </RegularText>
              Ghillies
            </RegularText>
            <FlatList
              horizontal={true}
              nestedScrollEnabled={true}
              contentContainerStyle={{
                paddingLeft: 15,
                paddingRight: 15
              }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              data={popularGhilliesByMembers}
              // estimatedItemSize={327}
              renderItem={({item}: any) => (
                <View mr={2}>
                  <GhillieCardV2
                    ghillie={item}
                    isVerifiedMilitary={isVerifiedMilitary}
                    onJoinPress={() => console.log("Join Pressed")}
                  />
                </View>
              )}
              refreshing={isLoadingPopularGhillies}
              ListEmptyComponent={
                <Center>
                  <Text style={{
                    color: Colors.secondary
                  }}>No Ghillies Found</Text>
                </Center>
              }
            />
          </View>
          
          <View style={styles.listContainer}>
            <RegularText style={{
              marginLeft: 15,
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10
            }}>
              <RegularText style={{
                marginLeft: 15,
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: "bold",
                color: colorsVerifyCode.secondary,
                marginBottom: 10
              }}>
                Trending{" "}
              </RegularText>
              Ghillies
            </RegularText>
            <FlatList
              horizontal={true}
              contentContainerStyle={{
                paddingLeft: 15,
                paddingRight: 15
              }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              data={trendingGhillies}
              // estimatedItemSize={327}
              renderItem={({item}: any) => (
                <View key={item.id} mb={2} mr={2}>
                  <GhillieCardV2
                    ghillie={item}
                    onJoinPress={(ghillie) => console.log(ghillie)}
                    isVerifiedMilitary={isVerifiedMilitary}
                  />
                </View>
              )}
              refreshing={isLoadingTrendingGhillies}
              ListEmptyComponent={
                <Center>
                  <Text style={{
                    color: Colors.secondary
                  }}>No Ghillies Found</Text>
                </Center>
              }
            />
          </View>
          
          <View style={styles.popularContainer}>
            <RegularText style={{
              marginLeft: 15,
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10
            }}>
              <RegularText style={{
                marginLeft: 15,
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: "bold",
                color: colorsVerifyCode.secondary,
                marginBottom: 10
              }}>
                New{" "}
              </RegularText>
              Ghillies
            </RegularText>
            <FlatList
              horizontal={true}
              contentContainerStyle={{
                paddingLeft: 15,
                paddingRight: 15
              }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              data={newGhillies}
              // estimatedItemSize={327}
              renderItem={({item}: any) => (
                <View key={item.id} mr={2}>
                  <GhillieCardV2
                    ghillie={item}
                    onJoinPress={() => console.log("Join Pressed")}
                    isVerifiedMilitary={isVerifiedMilitary}
                  />
                </View>
              )}
              refreshing={isLoadingNewGhillies}
              ListEmptyComponent={
                <Center>
                  <Text style={{
                    color: Colors.secondary
                  }}>No Ghillies Found</Text>
                </Center>
              }
            />
          </View>
        </View>
      </ScrollView>
    </MainContainer>
  );
}

export default GhillieListingScreen;
