import React from "react";
import {ScrollView, Spinner, Text, View} from "native-base";
import MainContainer from "../../../components/containers/MainContainer";
import styles from "../styles";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import {UserOutput} from "../../../shared/models/users/user-output.dto";
import AccountOverviewCard from "../../../components/account-overview-card";
import {useNavigation} from "@react-navigation/native";
import {GhillieDetailDto} from "../../../shared/models/ghillies/ghillie-detail.dto";
import ghillieService from "../../../shared/services/ghillie.service";
import {GhillieHorizontalList} from "../../../components/ghillie-horizontal-list";
import {PostListingDto} from "../../../shared/models/posts/post-listing.dto";
import {PageInfo} from "../../../shared/models/pagination/types";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {colorsVerifyCode} from "../../../components/colors";
import AccountTabBar from "../../../components/account-tab-bar";


function RenderGhillies({
                            isLoadingUserGhillies,
                            onGhilliePress,
                            userGhillies
                        }) {
    return isLoadingUserGhillies ? (
        <Spinner color="blue"/>
    ) : (
        <GhillieHorizontalList
            onGhilliePress={onGhilliePress}
            ghillieList={userGhillies}
            height={16}
            width={16}
        />
    );
}

function RenderPosts({}) {
    return <Text style={{
        color: colorsVerifyCode.secondary,
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center"
    }}>Coming Soon...</Text>;
}

function RenderSaved({}) {
    return <Text style={{
        color: colorsVerifyCode.secondary,
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center"
    }}>Coming Soon...</Text>;
}

function AccountScreen() {
    const [isLoadingUserGhillies, setIsLoadingUserGhillies] = React.useState(false);
    const [userGhillies, setUserGhillies] = React.useState<GhillieDetailDto[]>([]);

    // TODO - Circle back and add this view
    const [isLoadingUserPosts, setIsLoadingUserPosts] = React.useState(false);
    const [userPosts, setUserPosts] = React.useState<PostListingDto[]>([]);
    const [postPageInfo, setPostPageInfo] = React.useState<PageInfo>({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null
    });
    // TODO: Add post bookmarking and add this view

    const [tabSelection, setTabSelection] = React.useState(0);

    const myAccount: UserOutput = useSelector(
        (state: IRootState) => state.authentication.account
    );

    const navigation: any = useNavigation();

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    React.useEffect(() => {
        const initialLoadGhillies = navigation.addListener('focus', async () => {
            setTabSelection(0);
            setIsLoadingUserGhillies(true);
            const {data} = await ghillieService.getCurrentUserGhillies();
            setUserGhillies(data);
            setIsLoadingUserGhillies(false);
        });

        return initialLoadGhillies;
    }, [navigation]);

    const verifyMilitaryStatus = () => {
        console.log("Verify Military Status");
    }

    const onGhilliePress = (ghillieId?: string) => {
        moveTo("Ghillies", {screen: "GhillieDetail", params: {ghillieId: ghillieId}});
    }

    const onTabSelection = (selection: number) => {
        setTabSelection(selection);

        if (selection === 0) {
            setIsLoadingUserGhillies(true);
            ghillieService.getCurrentUserGhillies().then(({data}) => {
                setUserGhillies(data);
            });
            setIsLoadingUserGhillies(false);
        }
    }

    return (
        <MainContainer style={styles.container}>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginRight: 20,
                marginBottom: 20
            }}>
                {/* Create Icon Button, align right */}
                <TouchableOpacity onPress={() => moveTo("AccountSettings", {})}>
                    <Ionicons name="ios-cog" size={30} color={colorsVerifyCode.white}/>
                </TouchableOpacity>
            </View>
            <AccountOverviewCard
                account={myAccount}
                onVerifyClick={verifyMilitaryStatus}
            />
            <AccountTabBar selection={tabSelection} setSelection={onTabSelection}/>
            <ScrollView showsVerticalScrollIndicator={false} mt={5}>
                {tabSelection === 0 && (
                    <RenderGhillies
                        isLoadingUserGhillies={isLoadingUserGhillies}
                        onGhilliePress={onGhilliePress}
                        userGhillies={userGhillies}
                    />
                )}
                {tabSelection === 1 && (
                    <RenderPosts/>
                )}
                {tabSelection === 2 && (
                    <RenderSaved/>
                )}
            </ScrollView>
        </MainContainer>
    );
}

export default AccountScreen;
