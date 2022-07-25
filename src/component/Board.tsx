import React, {useEffect, useState} from "react";
import {CellData, CellImpl, CellState} from "../types/CellData";
import {Cell} from "./Cell";
import {Typography} from "@mui/material";
import {Turn} from "../types/Turn";
import {directionCheck} from "../types/DirectionCheck";

export const Board = () => {
    const [turn, setTurn] = useState<Turn>(Turn.WHITE)

    const [maxX, setMaxX] = useState(7)
    const [maxY, setMaxY] = useState(7)
    const [minX, setMinX] = useState(0)
    const [minY, setMinY] = useState(0)
    const [cells, setCells] = useState<CellData[]>(() => {
        const cells = [] as CellData[]
        const startX = ((maxX + 1) / 2) - 1
        const startY = ((maxY + 1) / 2) - 1

        cells.push(new CellImpl(startX, startY, true, CellState.WHITE))
        cells.push(new CellImpl(startX + 1, startY, true, CellState.BLACK))
        cells.push(new CellImpl(startX, startY + 1, true, CellState.BLACK))
        cells.push(new CellImpl(startX + 1, startY + 1, true, CellState.WHITE))
        return cells
    });

    function addCell(row: number, column: number, state: CellState) {
        console.log(`add input(${row}, ${column}), ${state}`)
        let added = false
        setCells(cells => {

            // 最大値超過チェック
            if (maxY < row || row < minY) {
                return cells
            }

            // 配置可能チェック
            /*
             8方向に対する配置可能チェックを行う。
             */
            const cell = new CellImpl(row, column, true, state)
            if(cells.find(c=>c.row===row&& c.col===column)){
                return cells
            }
            const directionCheckResult = directionCheck(cells, cell)

            console.log(directionCheckResult)
            // 塗り替え処理
            const newCells = cells.flatMap((c, i) => {
                const cChanged = directionCheckResult.map(result => {
                    let changed = false
                    if (result.reversibleIndexes.includes(i)) {
                        c.state = state
                        changed = true
                        added = true
                    }
                    return {...c, changed: changed}
                }).find(c => c.changed)
                return cChanged ? cChanged : c
            })
            if (!added) {
                return cells
            }

            newCells.push(cell)
            setTurn(prevState => prevState == Turn.BLACK ? Turn.WHITE : Turn.BLACK)

            return newCells
        })
    }

    function onClickFunction(row: number, col: number) {
        const clickedCell = cells.find(c => c.row == row && c.col == col)
        if (!clickedCell) {
            console.log("未配置セル", clickedCell)
        }

        // test
        addCell(row, col, turn == Turn.WHITE ? CellState.WHITE : CellState.BLACK)
    }

    console.log(`board drawing.`)

    return <>
        <Typography>{turn === Turn.BLACK ? "BLACK" : "WHITE"} of Turn</Typography>
        <div style={{
            display: "grid", gridTemplateColumns: `repeat(${maxY + 1}, 1fr)`, border: "thin"
        }}>
            {[...Array(maxX + 1).keys()].flatMap(row => {
                return [...Array(maxY + 1).keys()].map(col => {
                    const key = `cell_${row}_${col}`
                    const cell = cells.find(c => c.row == row && c.col == col)
                    if (!cell) {
                        const newCell: CellData = new CellImpl(row, col, false, CellState.NONE)
                        return <Cell key={key} {...newCell} onClick={async () => onClickFunction(row, col)}/>
                    }

                    return <Cell key={key} {...cell} onClick={async () => onClickFunction(row, col)}/>
                })
            })}
        </div>
    </>
}
