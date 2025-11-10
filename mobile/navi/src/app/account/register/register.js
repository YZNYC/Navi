import * as React from 'react-native'
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';

const openDb = async () => {
    return await SQLite.openDatabaseAsync('navi.db');
  }

  
  