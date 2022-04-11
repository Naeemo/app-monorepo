import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import {
  Box,
  Center,
  Pressable,
  Typography,
  Input,
  Token,
  HStack,
  Icon,
} from '@onekeyhq/components';
import { ValuedToken } from '../../../../store/typings';

type TokenInputProps = {
  token?: ValuedToken;
  label?: string;
  inputValue?: string;
  onPress?: () => void;
  onChange?: (text: string) => void;
};

const TokenInput: FC<TokenInputProps> = ({
  label,
  inputValue,
  onPress,
  token,
  onChange,
}) => {
  const intl = useIntl();
  return (
    <Box h="20" px="3" py="4">
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography.Caption>{label}</Typography.Caption>
        <Typography.Caption>
          {intl.formatMessage({ id: 'content__balance_str' }, { '0': 0 })}
        </Typography.Caption>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Input
          borderWidth={0}
          placeholder="0.00"
          pl="0"
          bg="transparent"
          _hover={{ bg: 'transparent' }}
          _focus={{ bg: 'transparent' }}
          value={inputValue}
          onChangeText={onChange}
        ></Input>
        <Pressable onPress={onPress}>
          <HStack alignItems="center">
            {token ? (
              <HStack alignItems="center" space={1}>
                <Token size="6" src={token.logoURI}></Token>
                <Typography.Body1>{token.symbol}</Typography.Body1>
              </HStack>
            ) : (
              <Typography.Body1>
                {intl.formatMessage({ id: 'form__search_tokens' })}
              </Typography.Body1>
            )}
            <Box ml="2">
              <Icon size={10} name="ChevronDownOutline"></Icon>
            </Box>
          </HStack>
        </Pressable>
      </Box>
    </Box>
  );
};

export default TokenInput;
