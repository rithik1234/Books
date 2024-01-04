using my.bookshop as my from '../db/data-model';
using my.bookshop as newbook from '../db/data-model';


service CatalogService @(path : '/catalog')
@(requires: 'authenticated-user')
{
    entity Books as projection on my.Books
    { *, null as newtitle: String,
         null as newtitle1: String}

    action getBookAction(ID:Integer)
    returns {
      title: String;
    };

    entity NewBooks
    @(restrict: [{ grant: 'READ',
                     to: 'Viewer'
                   },
                   { grant: 'WRITE',
                     to: 'Admin' 
                   }
                  ])
    
     as projection on newbook.NewBooks

};
    


