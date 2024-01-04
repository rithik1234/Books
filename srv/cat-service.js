const cds = require('@sap/cds'); 
module.exports = cds.service.impl(async function (srv) { 
    
    
    
    const { Books } = this.entities; 


 this.after('READ', Books, (each) => 
 { 
     each.newtitle = each.ID + " " + each.title; 
 }); 


 this.on('getBookAction', async (req) => {
    console.log(req);

    // Extract the ID parameter from the request
    const getID = req.data.ID;

    // Use parameters in the CQL query to avoid SQL injection
    const getBookInfo = await cds.run(SELECT.from(Books).where({ ID: getID }));
    
    // Check if a book with the specified ID was found
    if (getBookInfo.length > 0) {
        const bookTitle = getBookInfo[0].title;
        return { title: bookTitle };
    } else {
        // Handle the case where no book with the specified ID was found
        throw new Error(`No book found with ID: ${getID}`);
    }
});


// Define the before hook for CREATE operation
this.before('CREATE', 'Books', async (req) => {
    // Custom logic before creating a new record
    console.log('Before CREATE:', req);

    // Validate the 'stock' property
    if (req.stock < 0) {
      throw new Error('Stock cannot be negative. Please provide a valid stock value.');
    }

   


    // Continue with the creation logic if validation passes
    return req;
  });


  // Custom logic before a read operation on 'Books'
  this.on('READ', 'Books', async (req) => {
    console.log('Before READ:', req.query);

    // Continue with the read logic
    const result = await cds.tx(req).run(req.query);

    // Perform additional custom logic on the result if needed
    result.forEach(book => {
      // Modify or add properties to each book in the result
      book.title = book.title.toUpperCase();
    });

    return result;
  });



})