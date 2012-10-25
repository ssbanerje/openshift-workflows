var vertices = new Array("a","b","c","d","e","f","g","h","m","n");
var edges=[{a :"b"},{a:"c"},{b:"d"},{b:"f"},{c:"e"},{b:"g"},{d:"h"},{e:"m"},{m:"n"}];
//console.log(edges[0].a);
var l1=0;
var l2=0;
var root="a";
var level=new Array(10);
var temp=[];
nodes=vertices.length;
visited=1;
for (var i=0;i<10;i++)
{
level[i]=new Array(10);
}
level[l1][l2]=root;

/*for (var list in edges)
  {
  for (var key in edges[list])
    {
     //if (root==key)
     console.log(key);

    }
     }*/
function build_graph(root)
{
  for (var list in edges)
  {
      for (var key in edges[list])
    {
     if (root==key)
       {
            temp.push(edges[list][key]);

       }
       }
  }
for (var i=0;temp[i]!=null;i++)
{
 level[l1][l2]=temp[i];
 l2++;
 visited++;
}
  //console.log(level[0][0]);

//console.log(temp);
// clearing temp
while(temp.length>0)
  {
    temp.splice(temp.length - 1,1);
  }
}
function extend_graph()
{
l1++;
l2=0;
for (var i=0;level[l1-1][i]!=null;i++)
{
build_graph(level[l1-1][i]);
}
if(visited<nodes)
  {
  extend_graph();
  }
  }
//build_graph(root);
extend_graph();
console.log(level);

