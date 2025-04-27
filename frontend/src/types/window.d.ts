declare interface Window {
    game: {
      tiles: any[];
      inventory: { id: string; name: string }[];
    };
    socket: any;
  }  