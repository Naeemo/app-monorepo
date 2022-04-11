import React from 'react';
import { useIntl } from 'react-intl';
import { Box, Typography, HStack, IconButton, Center } from '@onekeyhq/components';

const SwapHeader = () => {
  const intl = useIntl();
  return (
    <Center w='full' my='6' px='4'>
      <Box display="flex" flexDirection="row" justifyContent="space-between" maxW='768' width='full'>
        <Typography.DisplayLarge>{intl.formatMessage({ id: 'title__swap' })}</Typography.DisplayLarge>
        <HStack>
          <IconButton type='plain' name='RefreshOutline'></IconButton>
          <IconButton type='plain' name='CogOutline'></IconButton>
        </HStack>
      </Box> 
    </Center>
  );
};

export default SwapHeader;
