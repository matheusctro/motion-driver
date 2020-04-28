import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import './styles.css';

import { IconButton, Button } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const columns = [
    { id: 'sequence', label: 'Sequência', minWidth: 100, align: 'center' },
    { id: 'cmmd', label: 'Comando', minWidth: 100, align: 'center' },
    { id: 'params', label: 'Parâmetros', minWidth: 100, align: 'center' },
];

function createData(sequence, cmmd, params) {
    // const density = population / size;
    return { sequence, cmmd, params };
}

const rows = [
    createData(1, 'MOVER', '10,20,0'),
    createData(2, 'DELAY','500'),
    createData(3, 'ACIONAR','0'),
    createData(4, 'DELAY','100'),
    createData(5, 'ACIONAR','1'),
];

const ProgramTable = (props) => {
    return (
        <Table stickyHeader aria-label="caption table">
            <TableHead>
                <TableRow>
                    <TableCell>Executar</TableCell>
                    {columns.map( (column) => (
                        <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                        >
                            {column.label}
                        </TableCell>
                    ))}
                    <TableCell>Ações</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { rows.map( (row) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>
                            <IconButton><PlayArrowIcon color="secundary" /></IconButton>
                        </TableCell>
                        {columns.map( (column) => {
                            const value = row[column.id];
                            return (
                                <TableCell align={column.align}>
                                    {value}
                                </TableCell>
                            );
                        })}
                        <TableCell>
                            <IconButton><EditIcon color="secundary" /></IconButton>
                            <IconButton><DeleteIcon color="secundary" /></IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ProgramTable;