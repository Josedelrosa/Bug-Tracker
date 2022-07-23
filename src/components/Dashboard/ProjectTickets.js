import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
// import { Link } from "react-router-dom";
import Link from "@mui/material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import AddTickets from "./AddTickets";
import TicketInfo from "./TicketInfo";
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "ticketName",
    numeric: false,
    disablePadding: true,
    label: "Ticket Title",
  },
  {
    id: "ticketDescription",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "createdBy",
    numeric: false,
    disablePadding: false,
    label: "Ticket Author",
  },
  {
    id: "edit",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all projects",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ fontWeight: 550 }}
          >
            {headCell.id !== "edit" && (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    projectNames,
    currentMembers,
    projectId,
    setCurrentMembers,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: "#243447",
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%", fontWeight: 600, color: "white" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Tickets
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            onClick={(e) => {
              projectNames(e);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton>
          <AddTickets
            currentMembers={currentMembers}
            projectId={projectId}
            setCurrentMembers={setCurrentMembers}
          />
        </IconButton>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function ProjectTickets({ id }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("ticketName");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState([]);
  // project refers to members in the project
  const {
    deleteMembers,
    getProjects,
    getTickets,
    tickets,
    deleteTickets,
    deleteUserTickets,
    setSingleTicket,
  } = useAuth();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    //this needs to change to const docRef = doc(db, "projects", id, tickets, ticketA);
    async function getProject() {
      await getTickets(id);
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);
      setProject(docSnap.data().members);
    }
    getProject();
  }, [id]);

  // console.log(tickets);
  // console.log(project);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tickets.map((n) => n);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  async function deleteSelectedRows(e) {
    e.preventDefault();
    setLoading(true);
    for (let i of selected) {
      try {
        console.log(i.userId);
        setError("");
        await deleteTickets(id, i.id);
        await deleteUserTickets(i.id, i.userId);
        // async function getProject() {
        //   await getTickets(id);
        // }
        // getProject();
      } catch (error) {
        setError("Failed to delete tickets");
        console.log(error);
      }
    }
    await getTickets(id);
    await getProjects();
    setLoading(false);
    setSelected([]);
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  //   const format = (value) => value.slice(0, 3).join(", ");

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tickets.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          projectNames={deleteSelectedRows}
          currentMembers={project}
          setCurrentMembers={setProject}
          projectId={id}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 500 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tickets.length}
            />

            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(tickets, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => handleClick(event, row)}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell scope="row" padding="none">
                        <Link
                          component="button"
                          underline="none"
                          style={{ fontWeight: 600, color: "black" }}
                          onClick={() => {
                            setSingleTicket(row);
                            console.info(row);
                          }}
                        >
                          {row.ticketName}
                        </Link>
                      </TableCell>
                      <TableCell align="left">
                        {row.ticketDescription}
                      </TableCell>
                      <TableCell align="left">{row.createdBy}</TableCell>
                      <TableCell align="left">
                        <IconButton onClick={(e) => {}}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
