# Project Report

## Database purpose:
manage an individual’s owned and desired items (personal inventory)

## Schema:
![ERD](/schema.png)

## Working Flow:

**Q**: Who owns the most electronics items?

**SQL**: 
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.email,
  COUNT(*) AS electronics_items_owned
FROM person p
JOIN person_item pi ON pi.person_id = p.id
JOIN item i ON i.id = pi.item_id
JOIN owned_item oi ON oi.item_id = i.id
JOIN category c ON c.id = i.category_id
WHERE c.title = 'Electronics'
GROUP BY p.id, p.first_name, p.last_name, p.email
ORDER BY electronics_items_owned DESC
LIMIT 1;

**A**: Emma Johnson (emma.johnson@example.com) owns the most electronics items, with **3** electronics items.

## Non-Working Flow:

**Q**: What is the maximum number of owned items that could be grouped together that have a combined value less than 1000?

**SQL**:
SELECT COUNT(*) AS max_items
FROM owned_item oi
JOIN item i ON i.id = oi.item_id
WHERE i.value > 0 AND i.value < 1000;

**A**: The maximum number of owned items that could be grouped together while keeping their combined value under 1000 is **17 items**.

## Additional Examples:

**Q**: What category of items has the most number of wanted items?

**SQL**:
SELECT
  c.id,
  c.title,
  COUNT(*) AS wanted_items_count
FROM wanted_item wi
JOIN item i ON i.id = wi.item_id
JOIN category c ON c.id = i.category_id
GROUP BY c.id, c.title
ORDER BY wanted_items_count DESC
LIMIT 1;

**A**: The **Outdoors** category has the most wanted items, with **3** wanted items.

<hr></hr>

**Q**: Who wants a Nintendo Switch?

**SQL**:
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.email
FROM person p
JOIN person_item pi ON pi.person_id = p.id
JOIN item i ON i.id = pi.item_id
JOIN wanted_item wi ON wi.item_id = i.id
WHERE i.title = 'Nintendo Switch'
ORDER BY p.last_name, p.first_name, p.id;

**A**: No one—there aren’t any people listed as wanting a **Nintendo Switch**.

<hr></hr>

**Q**: Which items are owned by multiple people?

**SQL**:
SELECT
  i.id AS item_id,
  i.title AS item_title,
  i.value,
  c.title AS category_title,
  COUNT(DISTINCT pi.person_id) AS owners_count
FROM item i
JOIN owned_item oi ON oi.item_id = i.id
JOIN person_item pi ON pi.item_id = i.id
JOIN category c ON c.id = i.category_id
GROUP BY i.id, i.title, i.value, c.title
HAVING COUNT(DISTINCT pi.person_id) > 1
ORDER BY owners_count DESC, i.title ASC;

**A**: The items owned by multiple people are:

- **iPhone 14 Pro** (Electronics) — **2** owners  
- **Nintendo Switch** (Gaming) — **2** owners

<hr></hr>

**Q**: What is the ratio of owned items to wanted items?

**SQL**:
SELECT
  COALESCE(owned.cnt, 0) / NULLIF(COALESCE(wanted.cnt, 0), 0) AS owned_to_wanted_ratio
FROM
  (SELECT COUNT(*) AS cnt FROM owned_item) AS owned
CROSS JOIN
  (SELECT COUNT(*) AS cnt FROM wanted_item) AS wanted;
  
**A**: The ratio of owned items to wanted items is **1.5**, meaning there are **about 1.5 owned items for every 1 wanted item**.

<hr></hr>

**Q**: Who owns the most items in excellent condition?

**SQL**:
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.email,
  COUNT(*) AS excellent_items_owned
FROM person p
JOIN person_item pi ON pi.person_id = p.id
JOIN owned_item oi ON oi.item_id = pi.item_id
WHERE oi.`condition` = 'Excellent'
GROUP BY p.id, p.first_name, p.last_name, p.email
ORDER BY excellent_items_owned DESC
LIMIT 1;

**A**: Emma Johnson (emma.johnson@example.com) owns the most items in excellent condition, with **2** such items.

<hr></hr>

**Q**: What is the oldest owned item in Excellent condition, and when was it obtained?

**SQL**:
SELECT
  i.id,
  i.title,
  oi.date_obtained
FROM owned_item oi
JOIN item i ON i.id = oi.item_id
WHERE oi.`condition` = 'Excellent'
ORDER BY oi.date_obtained ASC, i.id ASC
LIMIT 1;

**A**: The oldest owned item in **Excellent** condition is the **Kindle Paperwhite**, obtained on **March 18, 2023**.

## Prompting Strategies:

**Zero-shot**: performed decently well, with only a few questions resulting in poor responses

**In-domain one-shot**: performed very well, with no poor responses to this point in testing
