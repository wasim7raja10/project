# Invoice Management System

## Features
- Extract data from an invoice
- Supported file types: PDF, Excel, Image
- Supports multiple files upload
- CRUD operations for invoices, products, and customers
- Centralized state management using Redux Toolkit
    - Any changes made in any tab will be reflected in other tabs
- User feedback after an operation or error

## AI data extraction feature
- used gemini 1.5 flash model to extract data from the invoice
- the model is trained to extract data in a specific JSON format, so the data is extracted in a structured way
- the JSON schema is defined in `src/lib/gemini.ts`
- the prompt for the model is defined in `src/lib/gemini.ts`

## few observations on Gemini
- It is better to feed the model with a single invoice at a time, rather than multiple invoices at once. There is negligible error when extracting data from a single file, but when there are multiple files, the error rate spikes up.
- the prompt engineering can be further improved to get better results, especially when there are multiple invoices in a file.

## key decisions and assumptions
- the invoice is the source of truth and there should be only one invoice with a given serial number.
- the application enforces this by not allowing duplicate serial numbers in the invoice state.
- for extracting data from multiple files, gemini extracts data from a single file at a time and it repeated for each file in the upload queue.

## relationship between invoices, products and customers
- the invoice is the source of truth for the data. the products and customers are derived from the invoice.
- this means that the state does not store products and customers, only invoices. products and customers are essentially dependent on the invoice.
- this also means that the state does not have redundant data. for example, if a product exists in multiple invoices, it is only stored once in the state. this also applies to customers.
- this makes the state management simple and easier to maintain. **The application reacts to changes in the invoice state, and the dependent data (products and customers) will automatically update.**

## Test Cases 
 ● Case-1: Invoice pdfs ✔️
 ● Case-2: Invoice pdf + Images. ✔️
 ● Case-3: Excel File ✔️
 ● Case-4: Excel Files ✔️
 ● Case-5: All Types of Files ✔️

*Video Demo:* - https://drive.google.com/file/d/1655555555555555555555555555555555555555/view?usp=drive_link
