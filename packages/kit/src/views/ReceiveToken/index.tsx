import React, { useCallback } from 'react';

import { RouteProp, useRoute } from '@react-navigation/core';
import { Column, Row } from 'native-base';
import { useIntl } from 'react-intl';
import { TouchableOpacity } from 'react-native';

import {
  Account,
  Box,
  Icon,
  Modal,
  QRCode,
  Text,
  Typography,
  useIsVerticalLayout,
  useThemeValue,
} from '@onekeyhq/components';
import { copyToClipboard } from '@onekeyhq/components/src/utils/ClipboardUtils';
import qrcodeLogo from '@onekeyhq/kit/assets/qrcode_logo.png';

import { useToast } from '../../hooks/useToast';

import { ReceiveTokenRoutes, ReceiveTokenRoutesParams } from './types';

type NavigationProps = RouteProp<
  ReceiveTokenRoutesParams,
  ReceiveTokenRoutes.ReceiveToken
>;

const ReceiveToken = () => {
  const intl = useIntl();
  const toast = useToast();
  const borderColor = useThemeValue('border-subdued');
  const route = useRoute<NavigationProps>();

  const { address, name } = route.params;
  const isSmallScreen = useIsVerticalLayout();

  const copyAddressToClipboard = useCallback(() => {
    copyToClipboard(address);
    toast.info(intl.formatMessage({ id: 'msg__address_copied' }));
  }, [toast, address, intl]);

  return (
    <>
      <Modal
        footer={null}
        header={intl.formatMessage({ id: 'action__receive' })}
        height="auto"
        scrollViewProps={{
          children: (
            <Column flex={1}>
              <Box alignItems="center">
                <Box alignItems="center">
                  <Account
                    avatarSize="sm"
                    name={name}
                    address={address}
                    notShowAddress
                  />
                </Box>

                <Box
                  mt="16px"
                  borderRadius="3xl"
                  bgColor="white"
                  p={isSmallScreen ? '16px' : '11px'}
                  shadow="depth.4"
                >
                  <QRCode
                    value={address}
                    logo={qrcodeLogo}
                    size={isSmallScreen ? 264 : 186}
                    logoSize={isSmallScreen ? 57 : 40}
                    logoMargin={isSmallScreen ? 4 : 2}
                    logoBackgroundColor="white"
                  />
                </Box>
              </Box>
              <Row
                justifyContent="space-between"
                padding="16px"
                borderWidth="1px"
                borderRadius="12px"
                borderColor={borderColor}
                borderStyle="dashed"
                mt="24px"
              >
                <Text
                  textAlign="center"
                  typography="Body2"
                  flex={1}
                  noOfLines={3}
                >
                  {address}
                </Text>
              </Row>

              <TouchableOpacity onPress={copyAddressToClipboard}>
                <Row
                  mt="12px"
                  space="12px"
                  padding="10px"
                  justifyContent="center"
                >
                  <Icon name="DuplicateSolid" />
                  <Typography.Button1 textAlign="center">
                    {intl.formatMessage({
                      id: 'action__copy_address',
                    })}
                  </Typography.Button1>
                </Row>
              </TouchableOpacity>
            </Column>
          ),
        }}
      />
    </>
  );
};
export default ReceiveToken;
