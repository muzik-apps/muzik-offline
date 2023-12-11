import { profile1, profile2, profile3, profile4, profile5 } from "@assets/index";
import { FriendCard } from "@components/index";
import { useState } from "react";
import "@styles/layouts/UserFriends.scss";

const friends_list: {
    key: number;
    profile: string;
    name: string;
}[] = [
    {
        key: 0,
        profile: profile1,
        name: "Emily"
    },
    {
        key: 1,
        profile: profile2,
        name: "David"
    },
    {
        key: 2,
        profile: profile3,
        name: "John"
    },
    {
        key: 3,
        profile: profile4,
        name: "Chloe"
    },
    {
        key: 4,
        profile: profile5,
        name: "Sophie"
    },
    {
        key: 5,
        profile: profile1,
        name: "Rose"
    },
    {
        key: 6,
        profile: profile2,
        name: "Mark"
    },
    {
        key: 7,
        profile: profile3,
        name: "Luke"
    },
    {
        key: 8,
        profile: profile4,
        name: "Amanda"
    },
    {
        key: 9,
        profile: profile5,
        name: "Sophie"
    },
]

const UserFriends = () => {
    const [selectedFriend, setSelectedFriend] = useState<number>(0);

    function selectThisFriend(index: number){ setSelectedFriend(index); }

    return (
        <div className="UserFriends">
            {
                friends_list.map((friend, index) =>
                        <FriendCard 
                            key={friend.key} 
                            profile={friend.profile} 
                            name={friend.name} 
                            selected={selectedFriend === index ? true : false} 
                            index={index} 
                            isFriend={true}
                            selectThisPerson={selectThisFriend}
                            revokeFriendship={() => {}} />
                    )
            }
        </div>
    )
}

export default UserFriends