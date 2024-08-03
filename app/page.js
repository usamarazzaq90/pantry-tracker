"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  boxShadow,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import Link from "next/link";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      bgcolor="#4d4d4d"
      paddingBottom="2rem"
    >
      <Box
        width="100vw"
        height="15vh"
        display={"flex"}
        justifyContent={"space-around"}
        alignItems={"center"}
        bgcolor="#0d0d0d"
        color="white"
        padding="0 8vw"
      >
        <h1>Pantry Tracker</h1>
        <Link
          href="https://usamarazzaq.me"
          target="_blank"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          <h2>Usama Razzaq</h2>
        </Link>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <button
        className="button"
        style={{
          backgroundColor: "#0d0d0d",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          fontSize: "1rem",
        }}
        onClick={handleOpen}
      >
        Add New Item
      </button>
      <Box border={"3px solid #0d0d0d"}>
        <Box
          width="800px"
          height="80px"
          bgcolor={"#0d0d0d"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          marginBottom="20px"
        >
          <h2
            style={{
              color: "#fff",
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            Inventory Items
          </h2>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="80px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#b3b3b3"}
              paddingX={5}
            >
              <h3
                style={{
                  color: "#0d0d0d",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "500",
                }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </h3>
              <h3
                style={{
                  color: "#0d0d0d",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "500",
                }}
              >
                Quantity: {quantity}
              </h3>
              <Stack direction="row" spacing={2}>
                <button
                  className="button"
                  style={{
                    backgroundColor: "#0d0d0d",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                  }}
                  onClick={() => addItem(name)}
                >
                  Add
                </button>
                <button
                  className="button"
                  style={{
                    backgroundColor: "#0d0d0d",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                  }}
                  onClick={() => removeItem(name)}
                >
                  Remove
                </button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
