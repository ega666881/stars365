// src/stores/socketStore.ts
import { makeAutoObservable } from 'mobx';
import { io, Socket } from 'socket.io-client';
import clientStore from './clientStore';
import { backendIp } from '../utils/request';

class SocketStore {
  socket = null;
  spinResult = null;
  isConnected = false;

  constructor() {
    makeAutoObservable(this);
    this.connect()
  }

  connect() {
    const socket = io(backendIp);
    this.socket = socket;
    this.isConnected = true;

    
    socket.on('connect', () => {
        console.log('Подключено к WebSocket');
        
        this.isConnected = true;
    });

    socket.on('disconnect', () => {
        console.log('Отключено от WebSocket');
        this.sendUserLogout({id: clientStore.user.id})
        this.isConnected = false;
    });

    socket.on('active-users-count', (data) => {
        if (data.clientId === socket.id) {
            clientStore.setSettings(data.settings)
            clientStore.setActiveUsersCount(data.total)  
            clientStore.setWinsUsers(data.winsHistory)
            clientStore.setWinUserBar(data.winsHistory[0])
        }
    });
    
    socket.on('win-user', (data) => {
        clientStore.setWinUserBar(data)
    });
  }

  
  sendUserLogin(data) {
    if (this.socket) {
        console.log("login")
        this.socket.emit('userLogin', data);
      }
  }

  sendJoinRoom(data) {
    this.socket.emit("join-x10-room", data)
  }

  sendUserLogout(data) {
    if (this.socket) {
        this.socket.emit('userLogout', data);
      }
  }

  sendGetActiveUsersCount() {
    if (this.socket) {
        this.socket.emit('get-active-users-count', {});
      }
  }



}

const socketStore = new SocketStore();
export default socketStore;