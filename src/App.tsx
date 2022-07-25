import React, {useEffect, useState} from 'react';
import './App.css';
import {Container, Paper, Typography} from "@mui/material";
import {Board} from "./component/Board";

function App() {

    return <Container maxWidth="md">
        <Paper elevation={3}>
            <Typography variant={"h1"}>
                Othello
            </Typography>
            <Board></Board>
        </Paper>
    </Container>
}

export default App;
