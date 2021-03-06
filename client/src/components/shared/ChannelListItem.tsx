import { Channel, Message } from '../../types/graphql';
import { Image, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { ReactElement } from 'react';

import { IC_NO_IMAGE } from '../../utils/Icons';
import { getString } from '../../../STRINGS';
import moment from 'moment';
import styled from 'styled-components/native';
import { useThemeContext } from '@dooboo-ui/theme';

const StyledViewChatRoomListItem = styled.View`
  background-color: ${({ theme }): string => theme.itemBackground};
  min-height: 92px;
  padding: 8px 0;
  border-bottom-width: 1px;
  border-color: ${({ theme }): string => theme.underline};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledStatus = styled.View`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ theme }): string => theme.tintColor};
  right: 0;
  bottom: 0;
  border-width: 2px;
  border-color: ${({ theme }): string => theme.lineColor};
`;

const StyledViewContent = styled.View`
  flex-direction: column;
  flex: 1;
  padding-right: 20px;
`;

const StyledViewTop = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledTextDisplayName = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: ${({ theme }): string => theme.fontColor};
`;

const StyledTextWrapper = styled.View`
  background-color: ${({ theme }): string => theme.tintColor};
  width: 16px;
  height: 16px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const StyledTextCount = styled.Text`
  font-size: 10px;
  color: ${({ theme }): string => theme.primary};
`;

const StyledViewBottom = styled.View`
  margin-top: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledTextMessage = styled.Text<{ lastMessageCnt: number }>`
  font-size: 12px;
  color: ${({ theme }): string => theme.fontColor};
  max-width: 200px;
  ${({ lastMessageCnt }): string => (lastMessageCnt ? 'font-weight: bold;' : '')}
`;

const StyledTextDate = styled.Text`
  font-size: 12px;
  color: ${({ theme }): string => theme.fontSubColor};
  text-align: right;
`;

const StyledImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const StyledImageSmall = styled.Image`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin-right: 2px;
  margin-bottom: 2px;
`;

interface Props {
  testID?: string;
  key?: string;
  style?: ViewStyle;
  item: Channel;
  lastMessageCnt?: number;
  onPress?: () => void;
  fontColor?: string;
}

function ChannelListItem(props: Props): React.ReactElement {
  const {
    theme: { fontColor },
  } = useThemeContext();

  const {
    testID,
    key,
    item: {
      channelType = 'private',
      lastMessage,
      memberships,

      // lastMessage: {
      //   sender: { photoURL, isOnline, nickname },
      //   // @ts-ignore
      //   message,
      //   created,
      // },
    },
    lastMessageCnt = 0,
    onPress,
  } = props;

  const {
    messageType,
    text,
    imageUrls,
    fileUrls,
    createdAt,
  } = lastMessage as Message;

  if (channelType === 'private') {
    const users = memberships?.map((membership) => membership?.user);

    const photoURLs = memberships?.map((membership) => membership?.user?.thumbURL || membership?.user?.photoURL);
    const isOnline = memberships?.[0]?.user?.isOnline;

    const renderSingleImage = (photoURL: string | null | undefined): ReactElement => {
      if (photoURL) {
        return <StyledImage source={{ uri: photoURL }} />;
      }

      return <View
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StyledImage source={IC_NO_IMAGE} />
      </View>;
    };

    const renderMultiImages = (photoURLs: (string | null | undefined)[] | undefined): ReactElement => {
      return <View
        style={{
          width: 44,
          height: 44,
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}
      >
        {photoURLs?.map((photo, i) => {
          if (i > 3) return;

          if (!photo) {
            return <StyledImageSmall source={IC_NO_IMAGE} />;
          }

          return <StyledImageSmall key={i} source={{ uri: photo }} />;
        })}
      </View>;
    };

    return (
      <View key={key} style={{ width: '100%' }}>
        <TouchableOpacity
          testID={testID}
          activeOpacity={0.5} onPress={onPress}
        >
          <StyledViewChatRoomListItem>
            <View style={{ marginHorizontal: 20 }}>
              {
                !users || users.length === 1
                  ? renderSingleImage(photoURLs?.[0])
                  : renderMultiImages(photoURLs)
              }
              {isOnline ? <StyledStatus /> : <View />}
            </View>
            <StyledViewContent>
              <StyledViewTop>
                <StyledTextDisplayName
                  numberOfLines={2}
                >
                  {users?.map((v) => v?.nickname ?? v?.name ?? getString('NO_NAME')).join(', ')}
                </StyledTextDisplayName>
                {(lastMessageCnt) !== 0
                  ? <StyledTextWrapper>
                    <StyledTextCount>{lastMessageCnt}</StyledTextCount>
                  </StyledTextWrapper>
                  : null
                }
              </StyledViewTop>
              <StyledViewBottom>
                <StyledTextMessage
                  numberOfLines={2}
                  lastMessageCnt={lastMessageCnt}
                >
                  {
                    imageUrls && imageUrls.length > 0
                      ? getString('PHOTO')
                      : text
                  }
                </StyledTextMessage>
                <StyledTextDate>
                  {createdAt ? moment(createdAt).fromNow() : 'nan'}
                </StyledTextDate>
              </StyledViewBottom>
            </StyledViewContent>
          </StyledViewChatRoomListItem>
        </TouchableOpacity>
      </View>
    );
  }

  return <View/>;
}

export default ChannelListItem;
