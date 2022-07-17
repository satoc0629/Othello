import React, {useEffect, useState} from "react";
import {CellData, CellImpl, CellState} from "../types/CellData";
import {Cell} from "./Cell";
import {Typography} from "@mui/material";
import {Turn} from "../types/Turn";

export const Board = () => {
    const [turn, setTurn] = useState<Turn>(Turn.WHITE)
    const [cell, setCell] = useState<CellImpl>()
    const [cells, setCells] = useState<CellData[][]>();
    useEffect(() => {
        setCells(cells => {
            cells = [] as CellData[][]
            for (let row = 0; row < 8; row++) {
                const rows = Array<CellData>(8)
                for (let col = 0; col < 8; col++) {
                    rows[col] = {
                        row: row,
                        col: col,
                        exists: false,
                        state: CellState.NONE
                    } as CellData
                }
                cells.push(rows)
            }
            cells[3][3] = {...cells[3][3], state: CellState.WHITE, exists: true}
            cells[3][4] = {...cells[3][4], state: CellState.BLACK, exists: true}
            cells[4][3] = {...cells[4][3], state: CellState.BLACK, exists: true}
            cells[4][4] = {...cells[4][4], state: CellState.WHITE, exists: true}

            console.log(`cells:`, cells)
            const cell3x3 = new CellImpl(
                3, 3, true, CellState.WHITE
            )
            console.log(`cell3x3`, cell3x3.get(3, 3))
            const cell3x4 = new CellImpl(
                3, 4, true, CellState.BLACK
            )
            const cell4x3 = new CellImpl(
                4, 3, true, CellState.BLACK
            )
            const cell4x4 = new CellImpl(
                4, 4, true, CellState.WHITE
            )
            cell3x3.cell_6 = cell3x4
            cell3x3.cell_8 = cell4x3
            cell3x3.cell_9 = cell4x4
            cell3x4.cell_4 = cell3x3
            cell3x4.cell_7 = cell4x3
            cell3x4.cell_8 = cell4x4
            cell4x3.cell_2 = cell3x3
            cell4x3.cell_3 = cell3x4
            cell4x3.cell_6 = cell4x4
            cell4x4.cell_1 = cell3x3
            cell4x4.cell_2 = cell3x4
            cell4x4.cell_4 = cell4x3
            setCell(cell3x3)
            return cells
        })
    }, [])

    function onClickFunction(row: number, col: number) {
        if (!cells)
            return
        const cellOfArray = cells[row][col]
        console.log(`clicked cell`, cellOfArray)

        const clickedCell = cell?.get(row, col)
        if (!clickedCell) {
            console.log("未配置セル", clickedCell)

            clickedCell?.check(1, turn)
        }

        if (true) {
            setTurn(prevState => prevState == Turn.BLACK ? Turn.WHITE : Turn.BLACK)
        } else {
            alert("無効なセルです。")
        }
    }

    return <>
        <Typography>{turn === 0 ? "BLACK" : "WHITE"} of Turn</Typography>
        <div style={{display: "grid", gridTemplateColumns: "repeat(8, 1fr)", border: "thin"}}>

            {cells?.map(rows => rows.map(cell => <Cell {...cell}
                                                       onClick={async () => onClickFunction(cell.row, cell.col)}/>))}
        </div>
    </>
}