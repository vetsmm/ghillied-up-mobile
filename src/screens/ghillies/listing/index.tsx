import React, { useCallback, useEffect } from "react";
import MainContainer from "../../../components/containers/MainContainer";
import { useSelector } from "react-redux";
import { IRootState, useAppDispatch } from "../../../store";
import { getGhillies, getMyGhillies } from "../../../shared/reducers/ghillie.reducer";
import { Center, Column, FlatList, HStack, Spinner, Text, View } from "native-base";
import { RefreshControl } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from "./styles";
import { SearchInput } from "../../../components/search";
import uuid from "react-native-uuid";
import { GhillieCard } from "../../../components/cards/ghillie-listing";
import { Colors } from "../../../shared/styles";
import { useNavigation } from "@react-navigation/native";
import GhillieRow from "../../../components/ghillie-row";
import BigText from "../../../components/texts/big-text";


function GhillieListingHeader({ searchText, setSearchText, clearSearch, isVerifiedMilitary, isAdmin }) {
  const navigation: any = useNavigation();

  const handleNavigate = useCallback(() => {
    navigation.navigate("GhillieCreate");
  }, [navigation]);

  return (
    <HStack style={{ marginTop: 5 }}>
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
            onPress={() => handleNavigate()}
          >
            <Ionicons name="create-outline" size={30} color="white" />
          </TouchableOpacity>
        )}
      </Column>
      <Column width="76%">
        <SearchInput
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </Column>
      <Column width="12%">
        {searchText.length > 0 && (
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 40,
              marginBottom: 8,
              paddingRight: 20
            }}
            onPress={() => clearSearch()}
          >
            <MaterialIcons name="clear" size={30} color="white" />
          </TouchableOpacity>
        )}
      </Column>
    </HStack>
  );
}

function GhillieListingScreen() {
  const [offset, setOffset] = React.useState(1);
  const [searchText, setSearchText] = React.useState("");

  const ghillieList = useSelector(
    (state: IRootState) => state.ghillie.ghillieList
  );
  const myGhillies = useSelector(
    (state: IRootState) => state.ghillie.usersGhillieList
  );

  const isLoading = useSelector(
    (state: IRootState) => state.ghillie.loading
  );

  const [isVerifiedMilitary, isAdmin] = useSelector(
    (state: IRootState) => [
      state.authentication.isVerifiedMilitary,
      state.authentication.isAdmin
    ]);

  const dispatch = useAppDispatch();
  const navigation: any = useNavigation();

  useEffect(() => {
    dispatch(getGhillies({
      offset: 0,
      limit: 25
    }));
    dispatch(getMyGhillies());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(getGhillies({
      offset: 0,
      limit: 25
    }));
    dispatch(getMyGhillies());
  }, [dispatch]);

  const renderSpinner = () => {
    return <Spinner color="emerald.500" size="lg" />;
  };

  return (
    <MainContainer style={[styles.container]}>
      <GhillieListingHeader
        isVerifiedMilitary={isVerifiedMilitary}
        isAdmin={isAdmin}
        searchText={searchText}
        setSearchText={setSearchText}
        clearSearch={() => {
          setSearchText("");
          dispatch(getGhillies({
            offset: 0,
            limit: 25
          }));
        }}
      />

      <View mt={5}>
        <BigText style={{
          marginLeft: 15,
        }}>
          My Ghillies
        </BigText>
        <GhillieRow
          ghillieList={myGhillies}
          onPress={ghillie => {
            navigation.navigate("GhillieDetail", { ghillieId: ghillie.id });
          }}
        />
      </View>

      <FlatList
        keyExtractor={() => uuid.v4()?.toString()}
        showsVerticalScrollIndicator={false}
        data={ghillieList}
        renderItem={({ item, index }: any) => (
          <GhillieCard ghillie={item} index={index} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            progressBackgroundColor={Colors.secondary}
            tintColor={Colors.secondary}
          />
        }
        ListHeaderComponent={
          <View mt={5} mb={5}>
            <BigText style={{
              marginLeft: 15,
            }}>
              Explore Ghillies
            </BigText>
          </View>
        }
        ListEmptyComponent={
          <Center>
            <Text style={{
              color: Colors.secondary
            }}>No Ghillies Found</Text>
          </Center>
        }
        style={styles.list}
      />
    </MainContainer>
  );
}

export default GhillieListingScreen;
