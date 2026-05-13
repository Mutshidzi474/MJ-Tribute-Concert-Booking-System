<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Events</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/global.css">
</head>
<body>
<%- include('partials/navbar') %>

<div class="container py-5">
    <h1 class="mb-4">Available Events</h1>
    
    <% if (typeof error !== 'undefined' && error) { %>
        <div class="alert alert-danger"><%= error %></div>
    <% } %>

    <!-- Search and Filter Form -->
    <div class="card mb-4 shadow-sm">
        <div class="card-body">
            <h5 class="card-title mb-4">Search & Filter Events</h5>
            <form method="GET" action="/events" class="form-row align-items-end">
                <div class="form-group col-md-3">
                    <label>Search by Title, Location, or Description</label>
                    <input 
                        type="text" 
                        name="search" 
                        class="form-control" 
                        placeholder="e.g., Thriller, Johannesburg"
                        value="<%= typeof filters !== 'undefined' && filters.search ? filters.search : '' %>">
                </div>

                <div class="form-group col-md-2">
                    <label>From Date</label>
                    <input 
                        type="date" 
                        name="dateFrom" 
                        class="form-control"
                        value="<%= typeof filters !== 'undefined' && filters.dateFrom ? filters.dateFrom : '' %>">
                </div>

                <div class="form-group col-md-2">
                    <label>To Date</label>
                    <input 
                        type="date" 
                        name="dateTo" 
                        class="form-control"
                        value="<%= typeof filters !== 'undefined' && filters.dateTo ? filters.dateTo : '' %>">
                </div>

                <div class="form-group col-md-2">
                    <label>Category</label>
                    <select name="category" class="form-control">
                        <option value="">All Categories</option>
                        <% if (typeof categories !== 'undefined' && categories.length > 0) { %>
                            <% categories.forEach(cat => { %>
                                <option value="<%= cat %>" <%= typeof filters !== 'undefined' && filters.category === cat ? 'selected' : '' %>>
                                    <%= cat %>
                                </option>
                            <% }) %>
                        <% } %>
                    </select>
                </div>

                <div class="form-group col-md-2">
                    <label>&nbsp;</label>
                    <div class="custom-control custom-checkbox">
                        <input 
                            type="checkbox" 
                            class="custom-control-input" 
                            id="availabilityCheck" 
                            name="availability" 
                            value="true"
                            <%= typeof filters !== 'undefined' && filters.availability === 'true' ? 'checked' : '' %>>
                        <label class="custom-control-label" for="availabilityCheck">
                            Available Only
                        </label>
                    </div>
                </div>

                <div class="form-group col-md-1">
                    <button type="submit" class="btn btn-primary btn-block">Search</button>
                </div>
            </form>
            <% if ((typeof filters !== 'undefined' && Object.keys(filters).some(key => filters[key])) || (typeof filters !== 'undefined' && filters.search)) { %>
                <div class="mt-2">
                    <a href="/events" class="btn btn-link btn-sm">Clear Filters</a>
                </div>
            <% } %>
        </div>
    </div>

    <!-- Results Summary -->
    <% if (typeof filters !== 'undefined' && Object.keys(filters).some(key => filters[key])) { %>
        <div class="alert alert-info">
            Found <strong><%= events.length %></strong> event(s) matching your filters
        </div>
    <% } %>

    <% if (events && events.length > 0) { %>
        <div class="row">
            <% events.forEach(event => { %>
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title"><%= event.title %></h5>
                            <% if (event.category) { %>
                                <p class="card-text">
                                    <span class="badge badge-secondary"><%= event.category %></span>
                                </p>
                            <% } %>
                            <p class="card-text">
                                <strong>Date:</strong> <%= new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) %><br>
                                <strong>Location:</strong> <%= event.location %><br>
                                <strong>Price:</strong> R<%= event.price %> ZAR
                            </p>
                            <p class="card-text">
                                <small class="text-muted">
                                    Available: <%= event.ticketAvailable %> / <%= event.capacity %> tickets
                                </small>
                            </p>
                            <% if (event.description) { %>
                                <p class="card-text" style="font-size: 0.9rem;">
                                    <%= event.description.substring(0, 80) %>...
                                </p>
                            <% } %>
                        </div>
                        <div class="card-footer bg-white">
                            <% if (event.ticketAvailable > 0) { %>
                                <a href="/book" class="btn btn-primary btn-sm btn-block">Book Tickets</a>
                            <% } else { %>
                                <button class="btn btn-secondary btn-sm btn-block" disabled>Sold Out</button>
                            <% } %>
                        </div>
                    </div>
                </div>
            <% }); %>
        </div>
    <% } else { %>
        <div class="alert alert-info">No events available matching your filters. Try adjusting your search criteria.</div>
    <% } %>
</div>

<%- include('partials/footer') %>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
