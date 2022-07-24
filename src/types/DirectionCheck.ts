import {CellData, CellImpl} from "./CellData";

/**
 * 8方向の塗りつぶし可能チェック結果を持つ。
 * 5を除いた8方向のチェック結果を持つ
 */
export interface DirectionCheck {
    directionResults: DirectionResult[]
}

export type DirectionType = 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9

interface DirectionResult {
    direction: DirectionType
    reversibleIndexes: number[]
}

interface DirectionDuration {
    xDuration: number
    yDuration: number
}

type FoundCell = CellData & {
    index: number
}

function createDuration(direction: DirectionType): DirectionDuration {
    let xDuration = 0
    let yDuration = 0
    switch (direction) {
        case 1:
            xDuration -= 1
            yDuration -= 1
            break
        case 4:
            xDuration -= 1
            break
        case 7:
            xDuration -= 1
            yDuration += 1
            break
        case 2:
            yDuration -= 1
            break
        case 8:
            yDuration += 1
            break
        case 3:
            xDuration += 1
            yDuration += 1
            break
        case 6:
            xDuration += 1
            break
        case 9:
            xDuration += 1
            yDuration -= 1
    }
    return {
        xDuration: xDuration,
        yDuration: yDuration
    }
}

function check(cells: CellData[], cell: CellImpl, direction: DirectionType): DirectionResult {
    const directionDuration = createDuration(direction)
    let nextRow = cell.row + directionDuration.yDuration
    let nextCol = cell.col + directionDuration.xDuration
    const emptyResult = {direction: direction, reversibleIndexes: []} as DirectionResult

    const addFoundType = (c: CellData, i: number) => {
        console.log(`add Found Type ${i}`)
        return {...c, index: i} as FoundCell
    }
    // Direction方向かつ対となるState
    const nextCell = cells.map(addFoundType).find((c, i) => {
            console.log(`cells find ${i}(${c.row, c.col})`)
            return c.row === nextRow && c.col === nextCol && c.state !== cell.state
        }
    )

    if (!nextCell) {
        console.log(`next cell nothing.`)
        return emptyResult
    }

    const reversibleIndexes: number[] = []
    reversibleIndexes.push(nextCell.index)

    // 同じcell stateが続くまでカウントする
    let available = true
    nextRow += directionDuration.yDuration
    nextCol += directionDuration.xDuration
    while (available) {
        console.log(`loop:${nextRow}, ${nextCol}`)
        const nextCell = cells.map(addFoundType).find(c => c.row === nextRow && c.col === nextCol && c.state !== cell.state)
        if (nextCell) {
            reversibleIndexes.push(nextCell.index)
            nextRow += directionDuration.yDuration
            nextCol += directionDuration.xDuration
        }
        if (!nextCell) {
            available = false
        }
    }
    // 最終セルは、配置セルと同じ色
    const endCell = cells.map(addFoundType).find(c => c.row === nextRow && c.col === nextCol && c.state === cell.state)
    if (!endCell) {
        console.log(`end cell un match.`)
        return emptyResult
    }

    reversibleIndexes.push(endCell.index)

    return {
        reversibleIndexes: reversibleIndexes,
        direction: direction
    } as DirectionResult;
}

const range = [...Array(9).keys()].map(i => i + 1).filter(i => i !== 5)
export function directionCheck(cells: CellData[], cell: CellImpl) {
    // 0-8
    return range.map(direction => {
        console.log(`${new Date()}:directionCheck:${direction}`)
        return check(cells, cell, direction as DirectionType)
    })
}
