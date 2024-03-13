import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type PeerState = {
  peerId: string;
  metadata: {
    displayName: string;
    avatarUrl?: string;
  };
};
const peerInitialState: PeerState = {
  peerId: "",
  metadata: {
    displayName: "",
    avatarUrl: "",
  },
};
export const localPeerSlice = createSlice({
  name: "localPeer",
  initialState: peerInitialState,
  reducers: {
    updateLocalPeer: (state, action: PayloadAction<PeerState>) => {
      state.peerId = action.payload?.peerId;
      state.metadata = { ...state.metadata, ...action.payload?.metadata };
    },
  },
});

const remotePeersInitialState: { peerIds: string[]; peers: PeerState[] } = {
  peerIds: [] as string[],
  peers: [],
};
export const remotePeersSlice = createSlice({
  name: "remotePeers",
  initialState: remotePeersInitialState,
  reducers: {
    updateRemotePeer: (state, action: PayloadAction<PeerState>) => {
      const { peerId, ...peerData } = action.payload;
      const isExisting = state.peers.find((p) => p?.peerId === peerId);
      if (isExisting) {
        const updatedPeers = state.peers.map((p) => {
          if (p.peerId === peerId) {
            return { ...p, ...peerData }; // Updating existing user with new data
          }
          return p;
        });
        state.peers = updatedPeers;
      } else {
        const newUser = { peerId, ...peerData }; // Creating a new user with provided data
        state.peers.push(newUser);
        // return { ...state, peers: [...state.peers, newUser] };
      }
    },
    // addRemotePeer:(state,action)=>{
    // state.peers.push(action.)
    // },
    updateRemotePeerIds: (state, action: PayloadAction<string[]>) => {
      state.peerIds = action.payload;
    },
  },
});
const lobbyPeersInitialState: { peerIds: string[]; peers: PeerState[] } = {
  peerIds: [] as string[],
  peers: [],
};
export const lobbyPeersSlice = createSlice({
  name: "lobbyPeers",
  initialState: lobbyPeersInitialState,
  reducers: {
    updateLobbyPeer: (state, action: PayloadAction<PeerState>) => {
      const { peerId, ...peerData } = action.payload;
      const isExisting = state.peers.find((p) => p?.peerId === peerId);
      if (isExisting) {
        const updatedPeers = state.peers.map((p) => {
          if (p.peerId === peerId) {
            return { ...p, ...peerData }; // Updating existing user with new data
          }
          return p;
        });
        state.peers = updatedPeers;
      } else {
        const newUser = { peerId, ...peerData }; // Creating a new user with provided data
        state.peers.push(newUser);
        // return { ...state, peers: [...state.peers, newUser] };
      }
    },
    // addRemotePeer:(state,action)=>{
    // state.peers.push(action.)
    // },
    updateLobbyPeerIds: (state, action: PayloadAction<string[]>) => {
      state.peerIds = action.payload;
    },
  },
});

export const { updateLocalPeer } = localPeerSlice.actions;
export const { updateRemotePeer, updateRemotePeerIds } =
  remotePeersSlice.actions;
export const { updateLobbyPeer, updateLobbyPeerIds } = lobbyPeersSlice.actions;
