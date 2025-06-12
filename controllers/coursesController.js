import Resource from "../models/resource_schema.js";

const getAI=async(req,res)=>{
    const query={ category:"AI"};
    const resources = await Resource.find(query);
    req.session.Resource=resources;
    
  
res.render("pages/resources",{ resource: resources,user: req.session.User });
};
const getcyber=async(req,res)=>{
    const query={ category:"Cyber-Security"};
    const resources = await Resource.find(query);
    req.session.Resource=resources;
    
  
res.render("pages/resources",{ resource: resources,user: req.session.User });
};
const getsoftware=async(req,res)=>{
    const query={ category:"Software-Engineer"};
    const resources = await Resource.find(query);
    req.session.Resource=resources;
    
  
res.render("pages/resources",{ resource: resources,user: req.session.User });
};
const search=async (req,res)=>{
const {searchtext}=req.query;
console.log(searchtext)
const hh=(searchtext|| "").toLowerCase();
const regex= new RegExp(hh,"ig")
console.log(regex)
const query = {
    $or: [
      { name: regex },
      { category: regex },
      { link: regex },
      { description: regex },
      { image: regex },
    ],
  };
  Resource.find(query)
    .then((result) => {
        res.render("pages/resources",{ resource: result,user: req.session.User });
    })
    .catch((err) => console.log(err));
};

const resourcesDetails = async(req,res)=>{
    const resourceId = req.params.id;
    console.log(req.params);
    const rdetail= await Resource.findById(resourceId);
    return rdetail;
}
export {getAI,getcyber,getsoftware,search,resourcesDetails,};
