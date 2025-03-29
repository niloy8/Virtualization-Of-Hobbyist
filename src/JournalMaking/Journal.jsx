/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import "./Journal.css";
import Chart from "chart.js/auto";

const Journal = () => {
    const [entries, setEntries] = useState([]);
    const [journalTitle, setJournalTitle] = useState("");
    const [editorContent, setEditorContent] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [learningMinutes, setLearningMinutes] = useState("");
    const [editId, setEditId] = useState(null);
    const editorRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        loadEntries();
    }, []);

    useEffect(() => {
        renderChart();
    }, [entries]);

    const formatText = (command) => {
        if (command === "underline") {
            document.execCommand("underline", false, null);
        } else if (command === "justifyLeft") {
            document.execCommand("justifyLeft", false, null);
        } else if (command === "justifyCenter") {
            document.execCommand("justifyCenter", false, null);
        } else if (command === "justifyRight") {
            document.execCommand("justifyRight", false, null);
        } else {
            document.execCommand(command, false, null);
        }
    };

    const uploadImage = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            document.execCommand("insertImage", false, e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const saveEntry = () => {
        // Require both a journal title and content (and minutes)
        if (!journalTitle.trim() || !editorContent.trim() || !learningMinutes.trim()) return;

        const newEntry = {
            id: editId || Date.now(),
            title: journalTitle.trim(),
            content: editorRef.current.innerHTML,
            isPublic,
            date: new Date().toLocaleString(),
            minutes: parseInt(learningMinutes, 10),
        };

        let updatedEntries;
        if (editId) {
            updatedEntries = entries.map((entry) => (entry.id === editId ? newEntry : entry));
            setEditId(null);
        } else {
            updatedEntries = [...entries, newEntry];
        }

        setEntries(updatedEntries);
        localStorage.setItem("entries", JSON.stringify(updatedEntries));
        clearEditor();
    };

    const loadEntries = () => {
        const storedEntries = JSON.parse(localStorage.getItem("entries")) || [];
        setEntries(storedEntries);
    };

    const deleteEntry = (id) => {
        const updatedEntries = entries.filter((entry) => entry.id !== id);
        setEntries(updatedEntries);
        localStorage.setItem("entries", JSON.stringify(updatedEntries));
    };

    const editEntry = (id) => {
        const entry = entries.find((entry) => entry.id === id);
        setJournalTitle(entry.title);
        setEditorContent(entry.content);
        setIsPublic(entry.isPublic);
        setLearningMinutes(entry.minutes);
        setEditId(id);
        editorRef.current.innerHTML = entry.content;
    };

    const clearEditor = () => {
        setJournalTitle("");
        setEditorContent("");
        setIsPublic(false);
        setLearningMinutes("");
        setEditId(null);
        editorRef.current.innerHTML = "";
    };

    const renderChart = () => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext("2d");
        if (chartRef.current.chart) chartRef.current.chart.destroy();

        const dateMap = {};
        entries.forEach((entry) => {
            const date = entry.date.split(",")[0];
            dateMap[date] = (dateMap[date] || 0) + entry.minutes;
        });

        const dates = Object.keys(dateMap);
        const minutes = Object.values(dateMap);

        chartRef.current.chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: dates,
                datasets: [
                    {
                        label: "Minutes Learned",
                        data: minutes,
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
            },
        });
    };

    return (
        <div className="journal-container">
            <h1>Personal Journal</h1>

            {/* Journal Title Input */}
            <input
                type="text"
                placeholder="Journal Title"
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
                style={{ width: "90%", padding: "10px", marginBottom: "10px", borderRadius: "5px", fontSize: "16px" }}
            />

            {/* Button to Create New Journal */}
            <button className="new-journal-btn" onClick={clearEditor}>
                + New Journal
            </button>

            {/* Toolbar */}
            <div className="toolbar">
                <button onClick={() => formatText("bold")}>B</button>
                <button onClick={() => formatText("italic")}>I</button>
                <button onClick={() => formatText("insertUnorderedList")}>• List</button>
                <button onClick={() => formatText("underline")}>U</button>
                <button onClick={() => formatText("justifyLeft")}>Left</button>
                <button onClick={() => formatText("justifyCenter")}>Center</button>
                <button onClick={() => formatText("justifyRight")}>Right</button>
                <input type="file" id="imageUpload" onChange={uploadImage} style={{ display: "none" }} />
                <button onClick={() => document.getElementById("imageUpload").click()}>📷</button>
            </div>

            {/* Editor */}
            <div
                className="editor"
                contentEditable="true"
                ref={editorRef}
                onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
            ></div>

            {/* Privacy & Learning Minutes */}
            <div className="options">
                <label>
                    <input type="radio" checked={isPublic} onChange={() => setIsPublic(true)} /> Public
                </label>
                <label>
                    <input type="radio" checked={!isPublic} onChange={() => setIsPublic(false)} /> Private
                </label>
                <input
                    type="number"
                    placeholder="Minutes learned"
                    value={learningMinutes}
                    onChange={(e) => setLearningMinutes(e.target.value)}
                    min="1"
                />
            </div>

            {/* Save Button */}
            <button className="save-btn" onClick={saveEntry}>
                {editId ? "Update" : "Save"}
            </button>

            {/* Saved Journals Section */}
            <h2>Saved Journals</h2>
            <div className="saved-journals">
                {entries.length > 0 ? (
                    entries.map((entry) => (
                        <div key={entry.id} className="saved-entry">
                            <div className="saved-entry-title">
                                {entry.isPublic ? "🌐" : "🔒"} {entry.date} - {entry.minutes} min
                            </div>
                            <div className="saved-entry-preview">
                                {entry.title}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No saved journals yet.</p>
                )}
            </div>

            {/* Journal Entries */}
            <h2>All Entries</h2>
            <div className="entry-list">
                {entries.map((entry) => (
                    <div key={entry.id} className="entry">
                        <div className="entry-title">
                            {entry.isPublic ? "🌐" : "🔒"} {entry.date} - {entry.minutes} min
                        </div>
                        <div className="entry-preview">
                            {entry.title}
                        </div>
                        <div className="entry-actions">
                            <button onClick={() => editEntry(entry.id)}>Edit</button>
                            <button onClick={() => deleteEntry(entry.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <h2>Learning Progress</h2>
            <div className="chart-container">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

export default Journal;
