type User = {
  id: number;
  name: string;
  role: string;
};

type Plate = {
  id: number;
  number: string;
  regionCode: string;
  startingPrice: string;
  currentPrice: string;
  endTime: number;
  status: string;
};

type Bid = {
  id: number;
  plateId: number;
  userId: number;
  amount: string;
  createdAt: number;
};

// Global in-memory data
const data: {
  users: User[];
  plates: Plate[];
  bids: Bid[];
} = {
  users: [
    { id: 1, name: "admin", role: "admin" },
    { id: 2, name: "user", role: "user" }
  ],
  plates: [
    {
      id: 1,
      number: "777 AA",
      regionCode: "01",
      startingPrice: "5000000",
      currentPrice: "5000000",
      endTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
      status: "active"
    }
  ],
  bids: []
};

// Vercel serverless va in-memory data uchun
const db: any = {
  // Direct access uchun
  users: data.users,
  plates: data.plates,
  bids: data.bids,

  // SQL-style access (compatibility)
  prepare: (query: string) => {
    return {
      get: (...params: any[]) => {
        if (query.includes("FROM users")) {
          return data.users.find((u) => u.name === params[0]) || null;
        }

        if (query.includes("FROM plates WHERE id")) {
          return data.plates.find((p) => p.id === params[0]) || null;
        }

        return null;
      },

      all: (...params: any[]) => {
        if (query.includes("FROM plates ORDER BY")) {
          return [...data.plates];
        }
        if (query.includes("FROM bids")) {
          if (query.includes("WHERE plateId")) {
            return data.bids.filter(b => b.plateId === params[0]);
          }
          return data.bids;
        }
        return [];
      },

      run: (...params: any[]) => {
        if (query.includes("INSERT INTO plates")) {
          data.plates.push({
            id: Date.now(),
            number: params[0],
            regionCode: params[1],
            startingPrice: params[2],
            currentPrice: params[3],
            endTime: params[4],
            status: "active"
          });
        }

        if (query.includes("INSERT INTO bids")) {
          data.bids.push({
            id: Date.now(),
            plateId: params[0],
            userId: params[1],
            amount: params[2],
            createdAt: params[3]
          });
        }

        if (query.includes("UPDATE plates SET status")) {
          const plate = data.plates.find((p) => p.id === params[1]);
          if (plate) plate.status = params[0];
        }

        if (query.includes("UPDATE plates SET currentPrice")) {
          const plate = data.plates.find((p) => p.id === params[2]);
          if (plate) {
            plate.currentPrice = params[0];
            plate.endTime = params[1];
          }
        }

        if (query.includes("DELETE FROM plates")) {
          data.plates = data.plates.filter((p) => p.id !== params[0]);
        }

        if (query.includes("DELETE FROM bids")) {
          data.bids = data.bids.filter((b) => b.plateId !== params[0]);
        }
      }
    };
  },

  transaction: (fn: any) => {
    return (...args: any[]) => fn(...args);
  },

  exec: () => {}
};

export default db;