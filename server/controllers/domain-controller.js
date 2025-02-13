const whois = require('whois-json');
const dns = require('dns').promises;

const getdomaindetails = async (req, res) => {
    try {
      const domain = req.params.id; 
      const details = await whois(domain); 
      const nsRecords = await dns.resolveNs(domain);
      console.log('Domain Details:', details);
      res.status(200).json({ msg: details , ns:nsRecords});
  
    } catch (error) {
      console.error("Error fetching domain details:", error.message);
      
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

module.exports = { getdomaindetails};

