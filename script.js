let selectedNoteIndex = null;
let isEditing = true;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveNote').onclick = saveCurrentNote;
    document.getElementById('addNote').onclick = addNewNote;
    document.getElementById('deleteNote').onclick = deleteCurrentNote;
    document.getElementById('toggleEditView').onclick = toggleEditView;
    loadNotes();
});

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const noteList = document.querySelector('.note-list');
    noteList.innerHTML = '';
    if (notes.length === 0) {
        noteList.innerHTML = '<p>No notes saved yet.</p>';
    } else {
        notes.forEach((note, index) => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';
            noteCard.textContent = note.title || 'Untitled Note';
            noteCard.onclick = () => selectNote(index);
            noteList.appendChild(noteCard);
        });
    }
}

function selectNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    if (!notes[index]) return;
    selectedNoteIndex = index;
    const note = notes[index];
    document.getElementById('noteTitle').value = note.title || 'Untitled Note';
    document.getElementById('noteContent').value = note.content;
    const converter = new showdown.Converter();
    document.getElementById('noteContentDisplay').innerHTML = converter.makeHtml(note.content || '');
    showNoteContentDisplay();
}

function updateLocalStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

function saveCurrentNote() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    if (!title && !content) {
        alert('Cannot save an empty note.');
        return;
    }
    if (selectedNoteIndex !== null && selectedNoteIndex < notes.length) {
        notes[selectedNoteIndex] = { title, content };
    } else {
        notes.push({ title, content });
    }
    updateLocalStorage(notes);
    selectedNoteIndex = null;
    showNoteContentDisplay();
}

function addNewNote() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteContentDisplay').innerHTML = '';
    selectedNoteIndex = null;
    showNoteEditor();
}

function deleteCurrentNote() {
    if (selectedNoteIndex === null) {
        alert('No note selected to delete.');
        return;
    }
    let notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.splice(selectedNoteIndex, 1);
    updateLocalStorage(notes);
    addNewNote();
}

function toggleEditView() {
    isEditing = !isEditing;
    if (isEditing) {
        showNoteEditor();
    } else {
        const content = document.getElementById('noteContent').value.trim();
        const converter = new showdown.Converter();
        document.getElementById('noteContentDisplay').innerHTML = converter.makeHtml(content);
        showNoteContentDisplay();
    }
}

function showNoteEditor() {
    document.getElementById('noteContent').style.display = 'block';
    document.getElementById('noteContentDisplay').style.display = 'none';
    document.getElementById('toggleEditView').textContent = 'View';
}

function showNoteContentDisplay() {
    document.getElementById('noteContent').style.display = 'none';
    document.getElementById('noteContentDisplay').style.display = 'block';
    document.getElementById('toggleEditView').textContent = 'Edit';
}
