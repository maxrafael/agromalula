import { useNetInfo } from '@react-native-community/netinfo';
// import { useState, useEffect } from 'react';

export default function netStatus() {
  const netInfo = useNetInfo();
  return netInfo;
}
