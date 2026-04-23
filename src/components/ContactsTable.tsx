import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseIcon from "@mui/icons-material/Close";

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
}

const initialContacts: Contact[] = [
  {
    id: "c1",
    name: "",
    email: "transfert@scpp.fr",
    role: "Registrations",
    phone: "",
  },
];

const emptyContact = (): Contact => ({
  id: `c${Date.now()}${Math.floor(Math.random() * 1000)}`,
  name: "",
  email: "",
  role: "",
  phone: "",
});

interface ContactsTableProps {
  isEditing?: boolean;
}

export default function ContactsTable({ isEditing = false }: ContactsTableProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Contact | null>(null);

  const startEdit = (contact: Contact) => {
    setEditingRowId(contact.id);
    setDraft({ ...contact });
  };

  const cancelEdit = () => {
    // If the row being cancelled was just-added and still empty, remove it.
    if (draft && !draft.name && !draft.email && !draft.role && !draft.phone) {
      setContacts((prev) => prev.filter((c) => c.id !== draft.id));
    }
    setEditingRowId(null);
    setDraft(null);
  };

  const saveEdit = () => {
    if (!draft) return;
    setContacts((prev) => prev.map((c) => (c.id === draft.id ? draft : c)));
    setEditingRowId(null);
    setDraft(null);
  };

  const deleteRow = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (editingRowId === id) {
      setEditingRowId(null);
      setDraft(null);
    }
  };

  const addRow = () => {
    const newContact = emptyContact();
    setContacts((prev) => [...prev, newContact]);
    setEditingRowId(newContact.id);
    setDraft(newContact);
  };

  const updateDraftField = (field: keyof Contact, value: string) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const disabledAdd = !isEditing || editingRowId !== null;

  return (
    <Box sx={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 1.5 }}>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: "22%" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, width: "28%" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, width: "22%" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600, width: "18%" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600, width: "10%" }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ color: "text.secondary", fontStyle: "italic" }}>
                  No contacts yet. {isEditing ? "Click \u201CAdd contact\u201D below to create one." : ""}
                </TableCell>
              </TableRow>
            )}

            {contacts.map((contact) => {
              const isRowEditing = editingRowId === contact.id && draft !== null;
              const active = isRowEditing ? draft! : contact;

              return (
                <TableRow key={contact.id} hover>
                  <TableCell>
                    {isRowEditing ? (
                      <TextField
                        value={active.name}
                        onChange={(e) => updateDraftField("name", e.target.value)}
                        variant="standard"
                        size="small"
                        fullWidth
                        placeholder="Full name"
                      />
                    ) : (
                      active.name || <EmptyCell />
                    )}
                  </TableCell>

                  <TableCell>
                    {isRowEditing ? (
                      <TextField
                        value={active.email}
                        onChange={(e) => updateDraftField("email", e.target.value)}
                        variant="standard"
                        size="small"
                        fullWidth
                        placeholder="email@example.com"
                        type="email"
                      />
                    ) : (
                      active.email || <EmptyCell />
                    )}
                  </TableCell>

                  <TableCell>
                    {isRowEditing ? (
                      <TextField
                        value={active.role}
                        onChange={(e) => updateDraftField("role", e.target.value)}
                        variant="standard"
                        size="small"
                        fullWidth
                        placeholder="e.g. Registrations"
                      />
                    ) : (
                      active.role || <EmptyCell />
                    )}
                  </TableCell>

                  <TableCell>
                    {isRowEditing ? (
                      <TextField
                        value={active.phone}
                        onChange={(e) => updateDraftField("phone", e.target.value)}
                        variant="standard"
                        size="small"
                        fullWidth
                        placeholder="+33 1 ..."
                      />
                    ) : (
                      active.phone || <EmptyCell />
                    )}
                  </TableCell>

                  <TableCell align="right">
                    {isRowEditing ? (
                      <>
                        <Tooltip title="Save">
                          <span>
                            <IconButton size="small" onClick={saveEdit} color="primary">
                              <SaveOutlinedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <span>
                            <IconButton size="small" onClick={cancelEdit}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title={isEditing ? "Edit" : "Enable edit mode to modify"}>
                          <span>
                            <IconButton
                              size="small"
                              disabled={!isEditing || editingRowId !== null}
                              onClick={() => startEdit(contact)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title={isEditing ? "Delete" : "Enable edit mode to delete"}>
                          <span>
                            <IconButton
                              size="small"
                              disabled={!isEditing || editingRowId !== null}
                              onClick={() => deleteRow(contact.id)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={addRow}
          disabled={disabledAdd}
        >
          Add contact
        </Button>
      </Box>
    </Box>
  );
}

function EmptyCell() {
  return (
    <Box component="span" sx={{ color: "text.disabled" }}>
      &mdash;
    </Box>
  );
}
